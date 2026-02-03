// LifeOS Prototype Template (SwiftUI)
//
// This is a starting point for building high-fidelity LifeOS prototypes.
// It demonstrates how to:
// - Connect to the LifeOS backend API
// - Fetch context from the knowledge graph
// - Display mode information with native iOS styling
//
// To use:
// 1. Create a new Xcode project (App template, SwiftUI)
// 2. Copy these files into your project
// 3. Make sure the backend is running (cd backend && npm start)
// 4. Update the API_BASE URL if needed

import SwiftUI

@main
struct LifeOSPrototypeApp: App {
    @StateObject private var lifeOS = LifeOSClient()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(lifeOS)
        }
    }
}
