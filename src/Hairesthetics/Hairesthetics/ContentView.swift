//
//  ContentView.swift
//  Hairesthetics
//
//  Created by Charlotte Cheng on 2022-11-19.
//

import SwiftUI

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

#if DEBUG
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ContentView()
        }
    }
}
#endif
