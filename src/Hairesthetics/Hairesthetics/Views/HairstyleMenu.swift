//
//  ScrollMenu.swift
//  Hairesthetics
//
//  Created by Charlotte Cheng on 2022-11-19.
//

import SwiftUI

struct HairstyleMenu: View {
    @EnvironmentObject var settings: AppSettings
    let styles: [Box] = [
        Box(title:"Long", imageUrl:"hairstyle0"),
        Box(title:"Medium", imageUrl:"hairstyle1"),
        Box(title:"Short", imageUrl:"hairstyle2"),
        Box(title:"Long1", imageUrl:"hairstyle0"),
        Box(title:"Medium1", imageUrl:"hairstyle1"),
        Box(title:"Short1", imageUrl:"hairstyle2")
    ]
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
                                ForEach(styles) { style in
                                    BoxView(selectedBox: $settings.selectedHair, box: style)
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
