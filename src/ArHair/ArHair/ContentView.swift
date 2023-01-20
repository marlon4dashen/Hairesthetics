//
//  ContentView.swift
//  ArHair
//
//  Created by Qiushi Xu on 2022-11-23.
//

import SwiftUI
import RealityKit
import ARKit
class AppSettings: ObservableObject {
    @Published var currentMode: String? = "Haircolor"
    @Published var selectedHair: String? = nil
    @Published var selectedColor: String? = nil
    
}


struct ContentView : View {
    @State private var isPlacementEnabled = false
    @State private var selectedModel: String?
    @State private var modelConfirmed: String?
    @StateObject var settings = AppSettings()
    private var models: [String] = {
        let filemanager = FileManager.default
        guard let path = Bundle.main.resourcePath, let files = try?filemanager.contentsOfDirectory(atPath: path) else {
            return []
        }
        var availableodels: [String] = []
        for filename in files where filename.hasSuffix("usdz"){
            let modelName = filename.replacingOccurrences(of: ".usdz", with: "")
            availableodels.append(modelName)
        }
        return availableodels
    }()
    var body: some View {
        VStack(spacing: 0){
            // CameraView() # comment to run on simulator
        
        ZStack(alignment: .bottom){
            ARViewContainer(modelConfirmed: $modelConfirmed)
            if self.isPlacementEnabled{
                placeButtons(isPlacementEnabled: self.$isPlacementEnabled, selectedModel: self.$selectedModel, modelConfirmed: self.$modelConfirmed)
            }else{
                ModelPickerView(isPlacementEnabled: self.$isPlacementEnabled, selectedModel: self.$selectedModel,models: self.models)
            }
            
            
        }
            if settings.currentMode == "Hairstyle" {
                HairstyleMenu().environmentObject(settings)
            }else{
                HaircolorMenu().environmentObject(settings)
            }
            
        }
    }
}

struct ARViewContainer: UIViewRepresentable {
    @Binding var modelConfirmed: String?
    func makeUIView(context: Context) -> ARView {
        
        let arView = ARView(frame: .zero)
        let config = ARWorldTrackingConfiguration()
        config.planeDetection = [.horizontal, .vertical]
        config.environmentTexturing = .automatic
        if ARWorldTrackingConfiguration.supportsSceneReconstruction(.mesh){
            config.sceneReconstruction = .mesh
        }
        arView.session.run(config)
    
        
        return arView
        
    }
    
    func updateUIView(_ uiView: ARView, context: Context) {
        if let modelName = self.modelConfirmed{
            print("Debug3 \(modelName)")
            let filename = modelName+".usdz"
            let modelEntity = try! ModelEntity.loadModel(named: filename)
            let anchorEntity = AnchorEntity(plane: .any)
            anchorEntity.addChild(modelEntity)
            uiView.scene.addAnchor(anchorEntity)
            
            DispatchQueue.main.async {
                self.modelConfirmed = nil
            }
        }
    }
    
}
struct placeButtons: View{
    @Binding var isPlacementEnabled: Bool
    @Binding var selectedModel: String?
    @Binding var modelConfirmed: String?
    var body: some View{
        HStack {
            Button(action:{
                print("Debug1")
                self.isPlacementEnabled = false
                self.selectedModel = nil
            }){
                Image(systemName: "xmark").frame(width: 40, height: 40).font(.title).background(Color.white.opacity(0.75)).cornerRadius(20).padding(0)
            }
            Button(action:{
                print("Debug2")
                self.modelConfirmed = self.selectedModel
                self.isPlacementEnabled = false
                self.selectedModel = nil
            }){
                Image(systemName: "checkmark").frame(width: 40, height: 40).font(.title).background(Color.white.opacity(0.75)).cornerRadius(20).padding(0)
            }
        }
    }
}
struct ModelPickerView: View{
    @Binding var isPlacementEnabled: Bool
    @Binding var selectedModel: String?
    var models: [String]
    var body: some View{
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 30){
                ForEach(0..<self.models.count){
                    index in
                    Button(action: {
                        print("Debug: \(self.models[index])")
                        self.selectedModel = self.models[index]
                        self.isPlacementEnabled = true
                        
                    }) {
                        Image(uiImage: UIImage(named: self.models[index])!).resizable().frame(height:80).aspectRatio(1/1, contentMode: .fit).background(Color.white).cornerRadius(12)
                    }.buttonStyle(PlainButtonStyle())
                }
            }
        }
        .padding(20).background(Color.black.opacity(0.5))
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
