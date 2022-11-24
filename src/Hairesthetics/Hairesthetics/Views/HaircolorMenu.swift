//
//  HaircolorMenu.swift
//  Hairesthetics
//
//  Created by Charlotte Cheng on 2022-11-19.
//

import SwiftUI

struct HaircolorMenu: View {
    @EnvironmentObject var settings: AppSettings
    let colors: [Box] = [
        Box(title:"Brown", imageUrl:"hairstyle0"),
        Box(title:"Blonde", imageUrl:"hairstyle1"),
        Box(title:"Black", imageUrl:"hairstyle2"),
        Box(title:"Red", imageUrl:"hairstyle0"),
        Box(title:"Purple", imageUrl:"hairstyle1"),
        Box(title:"Blue", imageUrl:"hairstyle2")
    ]
    var body: some View {
        ZStack {
            VStack{
                Spacer()
                NavigationView{
                    VStack{
                        Button(settings.currentMode!) {
                            settings.currentMode = "Hairstyle"
                        }
                        .buttonStyle(.borderless)
                        .font(.subheadline)
                        .foregroundColor(.white)
                        .background(.black)
                        .offset(x: -UIScreen.main.bounds.width/2.5, y:20)
                        .frame(height:20)
                        
                        ScrollView (.horizontal, showsIndicators: false){
                            HStack{
                                ForEach(colors) { color in
                                    BoxView(selectedBox: $settings.selectedColor, box: color)
                                }
                            }
                        }
                        .frame(height: UIScreen.main.bounds.height/5)
                    }
                    .background(.black)
                    .frame(maxHeight: .infinity, alignment: .bottom)

                }
            }
        }
    }
}
