const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

interface WebRTCPeerOptions {
  onTrack: (stream: MediaStream) => void
  onIceCandidate: (candidate: RTCIceCandidate) => void
  onConnectionChange: (state: RTCPeerConnectionState) => void
}

export class WebRTCPeer {
  private pc: RTCPeerConnection
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream = new MediaStream()
  private _screenTrack: MediaStreamTrack | null = null

  constructor({ onTrack, onIceCandidate, onConnectionChange }: WebRTCPeerOptions) {
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })

    this.pc.onicecandidate = ({ candidate }) => {
      if (candidate) onIceCandidate(candidate)
    }

    this.pc.ontrack = ({ streams }) => {
      onTrack(streams[0])
    }

    this.pc.onconnectionstatechange = () => {
      onConnectionChange(this.pc.connectionState)
    }
  }

  async startLocalMedia({ audio = true, video = true }: { audio?: boolean, video?: boolean } = {}) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio, video })
      this.localStream.getTracks().forEach((track) => {
        this.pc.addTrack(track, this.localStream!)
      })
      return this.localStream
    } catch (err: any) {
      if (err.name === 'NotAllowedError') throw new Error('Camera/mic permission denied')
      if (err.name === 'NotFoundError') throw new Error('No camera or microphone found')
      throw err
    }
  }

  async startScreenShare() {
    try {
      const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true })
      const videoTrack = screenStream.getVideoTracks()[0]

      const sender = this.pc.getSenders().find((s) => s.track?.kind === 'video')
      if (sender) await sender.replaceTrack(videoTrack)

      videoTrack.onended = () => this.stopScreenShare()

      this._screenTrack = videoTrack
      return screenStream
    } catch (err) {
      throw new Error('Screen share cancelled or denied')
    }
  }

  async stopScreenShare() {
    if (!this._screenTrack) return
    this._screenTrack.stop()
    this._screenTrack = null

    // Revert to camera
    const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })
    const cameraTrack = cameraStream.getVideoTracks()[0]
    const sender = this.pc.getSenders().find((s) => s.track?.kind === 'video')
    if (sender) await sender.replaceTrack(cameraTrack)
  }

  async createOffer() {
    const offer = await this.pc.createOffer()
    await this.pc.setLocalDescription(offer)
    return offer
  }

  async handleOffer(offer: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await this.pc.createAnswer()
    await this.pc.setLocalDescription(answer)
    return answer
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(answer))
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (err) {
      console.warn('Failed to add ICE candidate:', err)
    }
  }

  toggleAudio(enabled: boolean) {
    this.localStream?.getAudioTracks().forEach((t) => (t.enabled = enabled))
  }

  toggleVideo(enabled: boolean) {
    this.localStream?.getVideoTracks().forEach((t) => (t.enabled = enabled))
  }

  destroy() {
    this.localStream?.getTracks().forEach((t) => t.stop())
    this._screenTrack?.stop()
    this.pc.close()
  }
}