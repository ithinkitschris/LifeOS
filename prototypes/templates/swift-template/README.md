# LifeOS Swift Prototype Template

This template provides a starting point for building high-fidelity LifeOS prototypes with native iOS styling.

## Setup Instructions

### 1. Create Xcode Project

1. Open Xcode
2. File → New → Project
3. Choose "App" under iOS
4. Configure:
   - Product Name: Your prototype name (e.g., "NavigationModePrototype")
   - Interface: SwiftUI
   - Language: Swift
5. Save to `/prototypes/active/` folder

### 2. Add Template Files

Copy these files into your new Xcode project:
- `LifeOSPrototypeApp.swift` → Replace the generated App file
- `ContentView.swift` → Replace the generated ContentView
- `LifeOSClient.swift` → Add to project

Or simply copy this entire template folder and open in Xcode.

### 3. Configure Network Access

For iOS Simulator to access localhost, add this to your `Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsLocalNetworking</key>
    <true/>
</dict>
```

### 4. Run Backend

Make sure the LifeOS backend is running:

```bash
cd /path/to/lifeos-platform/backend
npm install  # First time only
npm start
```

### 5. Run Prototype

1. Select your target device/simulator in Xcode
2. Click Run (⌘R)

## Customization

### Changing API URL

If your backend runs on a different port, update `LifeOSClient.swift`:

```swift
private let baseURL = "http://localhost:3001/api"
```

### Adding New API Calls

The `LifeOSClient` class provides a pattern for API calls:

```swift
func getRelationship(id: String) async -> Relationship? {
    do {
        return try await fetch(endpoint: "/context/relationships/\(id)")
    } catch {
        print("Error: \(error)")
        return nil
    }
}
```

### Styling

The template uses a dark theme matching LifeOS aesthetics. Key colors:
- Background: `Color.black`
- Secondary background: `Color(white: 0.1)`
- Border: `Color(white: 0.2)`
- Accent: `Color.blue`

## Project Structure

```
YourPrototype/
├── LifeOSPrototypeApp.swift    # App entry point
├── ContentView.swift            # Main view (customize this)
├── LifeOSClient.swift          # API client
└── Views/                       # Add custom views here
    └── YourCustomView.swift
```

## Tips

- Use `@EnvironmentObject var lifeOS: LifeOSClient` to access API in any view
- The client uses `async/await` - wrap API calls in `Task { }` blocks
- Preview provider is included for SwiftUI previews
- Add `#Preview` macros to test components in isolation
