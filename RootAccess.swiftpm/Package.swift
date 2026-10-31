// swift-tools-version: 5.9
// ROOT//ACCESS — Swift Playgrounds app. Open this .swiftpm folder in Swift Playgrounds (iPad or Mac) or Xcode 15+.
import PackageDescription
import AppleProductTypes

let package = Package(
    name: "RootAccess",
    platforms: [.iOS("17.0")],
    products: [
        .iOSApplication(
            name: "RootAccess",
            targets: ["AppModule"],
            bundleIdentifier: "com.rootaccess.game",
            displayVersion: "1.0",
            bundleVersion: "1",
            appIcon: .placeholder(icon: .code),
            accentColor: .presetColor(.green),
            supportedDeviceFamilies: [.pad, .phone],
            supportedInterfaceOrientations: [.portrait, .landscapeRight, .landscapeLeft, .portraitUpsideDown(.when(deviceFamilies: [.pad]))]
        )
    ],
    targets: [
        .executableTarget(name: "AppModule", path: ".")
    ]
)
