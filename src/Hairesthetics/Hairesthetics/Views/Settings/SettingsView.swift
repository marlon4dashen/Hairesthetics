import SwiftUI

struct SettingsView: View {
    
    // MARK: - Variable
    @Environment(\.presentationMode) var presentationMode

    
    var colorBrown = Color(UIColor(rgb: 0x000080))
    var colorGreen = Color(UIColor(rgb: 0xCBC3E3))
    // MARK: - View
    var body: some View {
        
        VStack(alignment: .center, spacing: 0) {
            
            // Form
            Form {
                Section(header: Text("Account")) {
                    buttonRow(iconName: "person.crop.circle", iconColor: colorBrown, text: "Switch Account", link: "https://www.google.com")
                    buttonRow(iconName: "person.2.fill", iconColor: colorBrown, text: "Workspace", link: "https://www.google.com")
                }
                .padding(.vertical, 1)
                
                Section(header: Text("Support")) {
                    buttonRow(iconName: "hand.raised.fill", iconColor: colorBrown, text: "Privacy Policy", link: "https://www.google.com")
                    buttonRow(iconName: "questionmark.circle.fill", iconColor: colorBrown, text: "Support", link: "https://www.google.com")
                    buttonRow(iconName: "hand.thumbsup.fill", iconColor: colorBrown, text: "Rate us", link: "https://www.google.com")
                    buttonRow(iconName: "envelope.fill", iconColor: colorBrown, text: "Feedback", link: "https://www.google.com")
                }
                .padding(.vertical, 1)
                
                Section(header: Text("About")) {
                    textRow(label: "Compatibility", value: "iPhone", iconName: "checkmark.circle.fill", iconColor: colorGreen)
                    textRow(label: "Programming Language", value: "Swift", iconName: "swift", iconColor: colorGreen)
                }
                .padding(.vertical, 1)

                
                
                // Footer
                HStack {
                    Spacer()
                    Text("@Hairesthetics 2022")
                        .padding(.vertical, 10)
                        .multilineTextAlignment(.center)
                        .font(.footnote)
                        .foregroundColor(.secondary)
                    Spacer()
                }
                
                
            }
            .listStyle(GroupedListStyle())
            .environment(\.horizontalSizeClass, .regular)
            .edgesIgnoringSafeArea(.all)
            
        }
        .navigationBarTitle("Settings", displayMode: .inline)
        // Hide the system back button
        .navigationBarBackButtonHidden(true)
        // Add your custom back button here
        .navigationBarItems(leading:
                                Button(action: {
                                    self.presentationMode.wrappedValue.dismiss()
                                }) {
                                    HStack {
                                        Image(systemName: "arrow.left.circle.fill")
                                        Text("Back")
                                    }
                                })

    }
    
}

