// Puts an audio file under a clip's picture without re-encoding the video.
// Any sound already in the video file is dropped, so the step can be repeated.
//
// Build:  swiftc -O tools/add-audio.swift -o /tmp/add-audio
// Run:    /tmp/add-audio <video.mp4> <audio.m4a> <out.mp4>
import AVFoundation

let args = CommandLine.arguments
guard args.count == 4 else {
    print("usage: add-audio <video.mp4> <audio.m4a> <out.mp4>")
    exit(2)
}
let video = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let audio = AVURLAsset(url: URL(fileURLWithPath: args[2]))
let outURL = URL(fileURLWithPath: args[3])

guard let videoTrack = video.tracks(withMediaType: .video).first else { print("no video track in \(args[1])"); exit(1) }
guard let audioTrack = audio.tracks(withMediaType: .audio).first else { print("no audio track in \(args[2])"); exit(1) }

let mix = AVMutableComposition()
let picture = mix.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
let sound = mix.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
do {
    try picture.insertTimeRange(CMTimeRange(start: .zero, duration: video.duration), of: videoTrack, at: .zero)
    let length = CMTimeMinimum(video.duration, audio.duration)
    try sound.insertTimeRange(CMTimeRange(start: .zero, duration: length), of: audioTrack, at: .zero)
} catch {
    print("could not combine the tracks: \(error)")
    exit(1)
}

try? FileManager.default.removeItem(at: outURL)
guard let export = AVAssetExportSession(asset: mix, presetName: AVAssetExportPresetPassthrough) else { print("no export session"); exit(1) }
export.outputURL = outURL
export.outputFileType = .mp4
export.shouldOptimizeForNetworkUse = true
let done = DispatchSemaphore(value: 0)
export.exportAsynchronously { done.signal() }
done.wait()
if export.status == .completed {
    print("wrote \(args[3])")
} else {
    print("export failed: \(String(describing: export.error))")
    exit(1)
}
