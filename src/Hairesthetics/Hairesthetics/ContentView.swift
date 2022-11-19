//
//  ContentView.swift
//  Hairesthetics
//
//  Created by Charlotte Cheng on 2022-11-19.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationView{
            Text("Hellow Word")
                .navigationBarTitle(Text("Hairesthetics"))
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
