//import UIKit
//import SwiftSocket
//import AVFoundation
//import CoreMedia
//
//
//class ViewController: UIViewController, AVCaptureVideoDataOutputSampleBufferDelegate {
//
//    let mainGroup = UIStackView()
//    let imageView = UIImageView(frame: CGRectZero)
//    var img: String = ""
//
//  @IBOutlet weak var textView: UITextView!
//
//  let host = "192.168.2.19"
//  let port = 8484
//  var client: TCPClient?
//
//  override func viewDidLoad() {
//    super.viewDidLoad()
//
//// 1. Layout Views
//      view.addSubview(mainGroup)
//      mainGroup.axis = NSLayoutConstraint.Axis.vertical
//      mainGroup.distribution = UIStackView.Distribution.fill
//
//      mainGroup.addArrangedSubview(imageView)
//
//      imageView.contentMode = UIView.ContentMode.scaleAspectFit
//
//
//      // 2. Create session & configure
//      let captureSession = AVCaptureSession()
//      captureSession.sessionPreset = AVCaptureSession.Preset.medium
//
//
//      // 3. set input
//
//      guard let backCamera = AVCaptureDevice.default(for: .video) else { return }
//      do {
//          let input = try AVCaptureDeviceInput(device: backCamera)
//
//          captureSession.addInput(input)
//      }
//      catch {
//          print("can't access camera")
//          return
//      }
//
//      // although we don't use this, it's required to get captureOutput invoked
//      let previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
//      view.layer.addSublayer(previewLayer)
//
//
//      // 4. set output & configure
//      let videoOutput = AVCaptureVideoDataOutput()
//      if captureSession.canAddOutput(videoOutput) {
//          captureSession.addOutput(videoOutput)
//      }
//      let queue = DispatchQueue(__label: "sample buffer delegate", attr: nil)
//      videoOutput.setSampleBufferDelegate(self, queue: queue)
//
//      // 5. Specify the pixel format
//      var strKey:String = kCVPixelBufferPixelFormatTypeKey as String
//      videoOutput.videoSettings = [strKey: UInt(kCVPixelFormatType_32BGRA)]
//
//
//      // 6. start running session
//      captureSession.startRunning()
//
//      client = TCPClient(address: host, port: Int32(port))
//      print("VIEW")
//
//
//  }
//
//    override func viewDidLayoutSubviews()
//    {
//        let topMargin = topLayoutGuide.length
//
//        mainGroup.frame = CGRect(x: 0, y: topMargin, width: view.frame.width, height: view.frame.height - topMargin).insetBy(dx: 5, dy: 5)
//    }
//
//    func captureOutput(captureOutput: AVCaptureOutput!, didOutputSampleBuffer sampleBuffer: CMSampleBuffer!, fromConnection connection: AVCaptureConnection!)
//    {
//
//        let image = imageFromSampleBuffer(sampleBuffer: sampleBuffer)
//
//        DispatchQueue.global(qos: .background).async {
//
//            // Background Thread
//
//            DispatchQueue.main.async {
//                // Run UI Updates
//                self.imageView.image = image
//            }
//        }
//
//    }
//
//    func imageFromSampleBuffer(sampleBuffer: CMSampleBuffer) -> UIImage {
//            let imageBuffer:CVImageBuffer! = CMSampleBufferGetImageBuffer(sampleBuffer)
//
//            CVPixelBufferLockBaseAddress(imageBuffer, CVPixelBufferLockFlags(rawValue: CVOptionFlags(0)))
//
//
//        let baseAddress: UnsafeMutableRawPointer = CVPixelBufferGetBaseAddress(imageBuffer)!
//            let bytesPerRow = CVPixelBufferGetBytesPerRow(imageBuffer)
//            let width = CVPixelBufferGetWidth(imageBuffer)
//            let height = CVPixelBufferGetHeight(imageBuffer)
//
//            let colorSpace = CGColorSpaceCreateDeviceRGB();
//
//            // Create a bitmap graphics context with the sample buffer data
//        let context = CGContext(data: baseAddress, width: width, height: height, bitsPerComponent: 8, bytesPerRow: bytesPerRow, space: colorSpace, bitmapInfo: CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.premultipliedFirst.rawValue);
//        let quartzImage = context!.makeImage()
//
//            CVPixelBufferUnlockBaseAddress(imageBuffer, CVPixelBufferLockFlags(rawValue: CVOptionFlags(0)))
//
//            // Create an image object from the Quartz image
//        let image = UIImage(cgImage:quartzImage!);
//
//            return (image);
//        }
//
//    private func encodeImage(image: UIImage) -> String {
//        let b64 = (image.pngData()?.base64EncodedString().appending("\n"))
//        return b64!
//    }
//
//
//    @IBAction func sendButtonAction() {
//        guard let client = client else { return }
//        switch client.connect(timeout: 10) {
//        case .success:
//          appendToTextField(string: "Connected to host \(client.address)")
//          if let response = sendRequest(string: "hi\n", using: client) {
//            appendToTextField(string: "Response: \(response)")
//          }
//        case .failure(let error):
//          appendToTextField(string: String(describing: error))
//        }
//  }
//
//  private func sendRequest(string: String, using client: TCPClient) -> String? {
//    appendToTextField(string: "Sending data ... ")
//
//    switch client.send(string: string) {
//    case .success:
//      return readResponse(from: client)
//    case .failure(let error):
//      appendToTextField(string: String(describing: error))
//      return nil
//    }
//  }
//
//  private func readResponse(from client: TCPClient) -> String? {
//    guard let response = client.read(1024*10) else { return nil }
//
//    return String(bytes: response, encoding: .utf8)
//  }
//
//  private func appendToTextField(string: String) {
//    print(string)
//    textView.text = textView.text.appending("\n\(string)")
//  }
//
//}
