// LifeOSClient.swift
// API client for connecting to the LifeOS backend

import Foundation
import SwiftUI

// MARK: - Data Models

struct LifeOSIdentity: Codable {
    let basics: IdentityBasics
    let personality: IdentityPersonality?
    let lifeos_relationship: LifeOSRelationship?
    
    struct IdentityBasics: Codable {
        let name: String
        let age: Int?
        let occupation: Occupation?
        
        struct Occupation: Codable {
            let primary: String?
            let secondary: String?
        }
    }
    
    struct IdentityPersonality: Codable {
        let summary: String?
        let communication_style: String?
    }
    
    struct LifeOSRelationship: Codable {
        let trust_level: String?
        let automation_preference: Double?
    }
}

struct LifeOSMode: Codable, Identifiable {
    let id: String
    let name: String
    let description: String
    let icon: String?
}

struct ModesResponse: Codable {
    let modes: [LifeOSMode]
}

struct ModeExplanationResponse: Codable {
    let text: String
    let cached: Bool?
    let stub: Bool?
}

struct ContextResponse: Codable {
    let scenario: String?
    let user: ContextUser?
    
    struct ContextUser: Codable {
        let name: String?
        let automation_preference: Double?
    }
}

// MARK: - LifeOS Client

@MainActor
class LifeOSClient: ObservableObject {
    // Change this if your backend runs on a different port
    private let baseURL = "http://localhost:3001/api"
    
    @Published var isLoading = true
    @Published var error: String? = nil
    @Published var identity: LifeOSIdentity? = nil
    @Published var modes: [LifeOSMode] = []
    @Published var values: [String: Any]? = nil
    
    init() {
        Task {
            await initialize()
        }
    }
    
    // MARK: - Initialization
    
    private func initialize() async {
        isLoading = true
        error = nil
        
        do {
            // Fetch identity
            identity = try await fetch(endpoint: "/context/identity")
            
            // Fetch modes
            let modesResponse: ModesResponse = try await fetch(endpoint: "/modes")
            modes = modesResponse.modes
            
            isLoading = false
        } catch {
            self.error = error.localizedDescription
            isLoading = false
        }
    }
    
    // MARK: - API Methods
    
    func getModeExplanation(modeName: String, action: String, trigger: String) async -> String? {
        do {
            let body: [String: Any] = [
                "mode_name": modeName,
                "action": action,
                "trigger_type": trigger
            ]
            
            let response: ModeExplanationResponse = try await post(
                endpoint: "/llm/explain-mode",
                body: body
            )
            
            return response.text
        } catch {
            print("getModeExplanation error: \(error)")
            return nil
        }
    }
    
    func getContext(scenario: String, params: [String: Any] = [:]) async -> ContextResponse? {
        do {
            let body: [String: Any] = [
                "scenario": scenario,
                "params": params
            ]
            
            return try await post(endpoint: "/context/assemble", body: body)
        } catch {
            print("getContext error: \(error)")
            return nil
        }
    }
    
    func generateText(prompt: String) async -> String? {
        do {
            let body: [String: Any] = ["prompt": prompt]
            let response: ModeExplanationResponse = try await post(
                endpoint: "/llm/generate",
                body: body
            )
            return response.text
        } catch {
            print("generateText error: \(error)")
            return nil
        }
    }
    
    // MARK: - Network Helpers
    
    private func fetch<T: Decodable>(endpoint: String) async throws -> T {
        guard let url = URL(string: baseURL + endpoint) else {
            throw URLError(.badURL)
        }
        
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        
        let decoder = JSONDecoder()
        return try decoder.decode(T.self, from: data)
    }
    
    private func post<T: Decodable>(endpoint: String, body: [String: Any]) async throws -> T {
        guard let url = URL(string: baseURL + endpoint) else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        
        let decoder = JSONDecoder()
        return try decoder.decode(T.self, from: data)
    }
}
