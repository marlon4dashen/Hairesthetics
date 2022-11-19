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
    
    let box: Box
    var body: some View{
        VStack{
            Image(box.imageUrl)
                .resizable()
                .scaledToFill()
                .frame(width: 80, height: 80)
                .clipped()
                .cornerRadius(12)
                .opacity(self.box.title == selectedBox ? 0.5: 1)
                .foregroundColor(self.box.title == selectedBox ? Color.gray : Color.white)
            Text(box.title)
                .font(.subheadline)
                .fontWeight(.semibold)
        }.onTapGesture {
            self.selectedBox = self.box.title
        }
    }
}

