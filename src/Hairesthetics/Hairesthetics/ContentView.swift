//
//  ContentView.swift
//  Hairesthetics
//
//  Created by Charlotte Cheng on 2022-11-19.
//

import SwiftUI
import AVFoundation

struct ContentView: View {
    @State var selectedBox: String? = nil
    let hairstyles: [Box] = [
        Box(title:"Long", imageUrl:"hairstyle0"),
        Box(title:"Medium", imageUrl:"hairstyle1"),
        Box(title:"Short", imageUrl:"hairstyle2"),
        Box(title:"Long1", imageUrl:"hairstyle0"),
        Box(title:"Medium1", imageUrl:"hairstyle1"),
        Box(title:"Short1", imageUrl:"hairstyle2")
    ]
    var body: some View {
        VStack{
            CameraView()
            NavigationView{
                ScrollView{
                    HStack{
                        ForEach(hairstyles) { hair in
                            BoxView(selectedBox: self.$selectedBox, box: hair)
                        }
                    }
                }
                .padding(5)

            }
        }
    }
}




struct CameraView: View {

    @StateObject var camera = CameraModel()

    var body: some View {
        ZStack {
            CameraPreview(camera: camera)
                .ignoresSafeArea(.all, edges: .all)

            VStack {

                if camera.isTaken {
                    HStack {
                        Spacer()

                        Button(action: camera.reTake, label: {
                            Image(systemName: "camera")
                                .foregroundColor(.black)
                                .padding()
                                .background(Color.white)
                                .clipShape(Circle())
                        })
                        .padding(.trailing, 10)
                    }
                }

                Spacer()

                HStack {

                    if camera.isTaken {

                        Button(action: {if !camera.isSaved {
                            camera.savePic()
                        }}, label: {
                            Text(camera.isSaved ? "Saved" : "Save")
                                .foregroundColor(.black)
                                .fontWeight(.semibold)
                                .padding(.vertical, 10)
                                .padding(.horizontal, 20)
                                .background(Color.white)
                                .clipShape(Capsule())
                        })
                        .padding(.leading)

                        Spacer()
                    } else {
                        Button(action: camera.takePic, label: {

                            ZStack {
                                Circle()
                                    .fill(Color.white)
                                    .frame(width: 65, height: 65)
                                Circle()
                                    .stroke(Color.white, lineWidth: 2)
                                    .frame(width: 75, height: 75)
                            }
                        })
                    }
                }
                .frame(height: 75)
            }
        }
        .onAppear(perform: {
            camera.Check()
        })
    }
}

class CameraModel: NSObject, ObservableObject, AVCapturePhotoCaptureDelegate {
    @Published var isTaken = false

    @Published var session = AVCaptureSession()

    @Published var alert = false

    @Published var output = AVCapturePhotoOutput()

    @Published var preview: AVCaptureVideoPreviewLayer!

    @Published var isSaved = false

    @Published var picData = Data(count: 0)

    func Check() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            setUp()
            return
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video, completionHandler: {
                (status) in
                if status {
                    self.setUp()
                }
            })
        case .denied:
            self.alert.toggle()
            return
        default:
            return
        }
    }

    func setUp() {
        do {
            self.session.beginConfiguration()

//            let device = AVCaptureDevice.default(.builtInDualCamera, for: .video, position: .back)

            guard let device: AVCaptureDevice = AVCaptureDevice.default(.builtInWideAngleCamera,
                for: .video, position: .back) else {
                return
            }
//            self.currentCamera = device
            let input = try AVCaptureDeviceInput(device: device)

            if self.session.canAddInput(input) {
                self.session.addInput(input)
            }

            if self.session.canAddOutput(self.output) {
                self.session.addOutput(self.output)
            }

            self.session.commitConfiguration()
        } catch {
            print(error.localizedDescription)
        }
    }

    func takePic() {
        DispatchQueue.global(qos: .background).async {
            self.output.capturePhoto(with: AVCapturePhotoSettings(), delegate: self)
            self.session.stopRunning()

            DispatchQueue.main.async {
                withAnimation(.default, {
                        self.isTaken.toggle()
                })
            }
        }
    }

    func reTake() {
        DispatchQueue.global(qos: .background).async {
            self.session.startRunning()

            DispatchQueue.main.async {
                withAnimation(.default, {self.isTaken.toggle()})
                self.isSaved = false
            }
        }
    }

    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        if error != nil {
            return
        }

        print("pic taken...")

        guard let imageData = photo.fileDataRepresentation() else {return}

        self.picData = imageData
    }

    func savePic() {
        let image = UIImage(data: self.picData)!

        UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)

        self.isSaved = true

        print("saved succesfully")
    }
}

struct CameraPreview: UIViewRepresentable {

    @ObservedObject var camera: CameraModel

    func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: UIScreen.main.bounds)

        camera.preview = AVCaptureVideoPreviewLayer(session: camera.session)
        camera.preview.frame = view.frame

        camera.preview.videoGravity = .resizeAspectFill
        view.layer.addSublayer(camera.preview)

        camera.session.startRunning()

        return view
    }

    func updateUIView(_ uiView: UIView, context: Context) {

    }
}

#if DEBUG
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ContentView()
        }
    }
}
#endif
