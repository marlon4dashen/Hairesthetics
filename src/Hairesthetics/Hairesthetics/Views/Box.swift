//
//  Box.swift
//  Hairesthetics
//
//  Created by Charlotte Cheng on 2022-11-19.
//

import SwiftUI

struct Box : Identifiable {
    var id = UUID()
    let title, imageUrl: String
    
}
struct BoxView: View{
    @Binding var selectedBox: String?
    @Binding var box: String?
    @Binding var isPlacementEnabled: Bool
    
    
    var body: some View{
        VStack{
            Image(box!)
                .resizable()
                .scaledToFill()
                .frame(width: 80, height: 80)
                .clipped()
                .cornerRadius(12)
                .opacity(box! == selectedBox ? 0.5: 1)
                .foregroundColor(box! == selectedBox ? Color.gray : Color.white)
            Text(box!)
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(.white)
        }.onTapGesture {
            print(box!)
            self.selectedBox = self.box!
            self.isPlacementEnabled = true
        }
    }
}

