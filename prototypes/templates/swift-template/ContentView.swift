// ContentView.swift
// LifeOS Prototype Template

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var lifeOS: LifeOSClient
    @State private var selectedMode: String? = nil
    @State private var modeExplanation: String = ""
    @State private var showingContext: Bool = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()
                
                if lifeOS.isLoading {
                    LoadingView()
                } else if let error = lifeOS.error {
                    ErrorView(message: error)
                } else {
                    mainContent
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("LifeOS")
                        .font(.headline)
                        .foregroundColor(.white)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Text(lifeOS.identity?.basics.name ?? "User")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
            }
            .toolbarBackground(Color.black.opacity(0.8), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
        }
        .preferredColorScheme(.dark)
    }
    
    var mainContent: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Mode Explanation Banner
                if !modeExplanation.isEmpty {
                    ModeBanner(text: modeExplanation)
                }
                
                // Mode Selection
                VStack(alignment: .leading, spacing: 12) {
                    SectionHeader(title: "Current Mode")
                    
                    LazyVGrid(columns: [
                        GridItem(.flexible()),
                        GridItem(.flexible())
                    ], spacing: 12) {
                        ForEach(lifeOS.modes, id: \.id) { mode in
                            ModeCard(
                                mode: mode,
                                isSelected: selectedMode == mode.id
                            ) {
                                selectMode(mode.id)
                            }
                        }
                    }
                }
                .padding(.horizontal)
                
                // Prototype Area
                VStack(alignment: .leading, spacing: 12) {
                    SectionHeader(title: "Prototype Area")
                    
                    PrototypeArea()
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
    }
    
    private func selectMode(_ modeId: String) {
        selectedMode = modeId
        
        Task {
            let explanation = await lifeOS.getModeExplanation(
                modeName: modeId,
                action: "entry",
                trigger: "manual"
            )
            
            await MainActor.run {
                withAnimation(.easeInOut(duration: 0.3)) {
                    modeExplanation = explanation ?? "Entering \(modeId) mode."
                }
            }
        }
    }
}

// MARK: - Supporting Views

struct LoadingView: View {
    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
                .tint(.white)
            Text("Loading LifeOS...")
                .foregroundColor(.secondary)
        }
    }
}

struct ErrorView: View {
    let message: String
    
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 40))
                .foregroundColor(.red)
            
            Text("Connection Error")
                .font(.headline)
            
            Text(message)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            Text("Make sure the backend is running")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
    }
}

struct ModeBanner: View {
    let text: String
    
    var body: some View {
        HStack {
            Text(text)
                .font(.subheadline)
                .foregroundColor(.secondary)
            Spacer()
        }
        .padding()
        .background(Color(white: 0.1))
    }
}

struct SectionHeader: View {
    let title: String
    
    var body: some View {
        Text(title.uppercased())
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundColor(.secondary)
            .tracking(0.5)
    }
}

struct ModeCard: View {
    let mode: LifeOSMode
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 4) {
                Text(mode.name)
                    .font(.headline)
                    .foregroundColor(.white)
                
                Text(mode.description)
                    .font(.caption)
                    .foregroundColor(isSelected ? .white.opacity(0.8) : .secondary)
                    .lineLimit(2)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding()
            .background(isSelected ? Color.blue : Color(white: 0.1))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Color.blue : Color(white: 0.2), lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }
}

struct PrototypeArea: View {
    var body: some View {
        VStack(spacing: 12) {
            Text("Replace this area with your prototype content.")
                .foregroundColor(.secondary)
            
            Text("This template provides native iOS styling and LifeOS API integration.")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(40)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .stroke(style: StrokeStyle(lineWidth: 2, dash: [8, 4]))
                .foregroundColor(Color(white: 0.2))
        )
    }
}

#Preview {
    ContentView()
        .environmentObject(LifeOSClient())
}
