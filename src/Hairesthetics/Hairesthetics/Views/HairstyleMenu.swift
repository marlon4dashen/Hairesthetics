//
//  ScrollMenu.swift
//  Hairesthetics
//
//  Created by Charlotte Cheng on 2022-11-19.
//

import SwiftUI

struct HairstyleMenu: View {
    @EnvironmentObject var settings: AppSettings

    var body: some View {
        ZStack {
            VStack{
                Spacer()
                NavigationView{
                    VStack{
                        Button(settings.currentMode!) {
                            settings.currentMode = "Haircolor"
                        }
                        .buttonStyle(.borderless)
                        .font(.subheadline)
                        .foregroundColor(.white)
                        .background(.black)
                        .offset(x: -UIScreen.main.bounds.width/2.5, y:20)
                        .frame(height:20)
                        
                        ScrollView (.horizontal, showsIndicators: false){
                            HStack{
                                ForEach(0..<self.settings.models.count){
                                    index in
                                    BoxView(selectedBox: $settings.selectedModel, box: $settings.models[index], isPlacementEnabled: $settings.isPlacementEnabled)
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
