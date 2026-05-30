# Ummah Connect — Complete Application Architecture & Implementation Plan

This document serves as the high-level, production-ready architectural spec and system design blueprint for **Ummah Connect**, a 100% Islamic Social Media and Community Platform. 

Designed by a Senior Flutter, Firebase, UI/UX, and Islamic Social Platform Architect.

---

## 1. High-Level App Architecture (Clean Architecture)

Ummah Connect is structured using **Clean Architecture** combined with a **Feature-First Development Pattern** to ensure strict separation of concerns, ease of testing, rapid feature deployment, and high maintainability.

```
                    ┌─────────────────────────┐
                    │     UI Layer (User)     │
                    │  Screens, Widgets, PM   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      Domain Layer       │
                    │ Use Cases, Entities, Rep│ (Core Business Logic - Zero Dependencies)
                    └────────────▲────────────┘
                                 │
                                 │ (Implements Repositories)
                    ┌────────────┴────────────┐
                    │       Data Layer        │
                    │ Models, Datasources, Rep│ (Firebase, Local DB, APIs)
                    └─────────────────────────┘
```

### Architectural Principles
1. **Dependency Inversion**: Outer layers (Data and Presentation) depend on inner layers (Domain). Domain is completely independent of external packages, including Flutter or Firebase, making it easily testable with mock data.
2. **Feature-First Structure**: Co-locates presentation, domain, and data files within feature directories. This makes developers 10x faster when modifying or extending a particular feature (e.g., communities or reels).

---

## 2. Complete Flutter Directory Structure

To maintain clean separations of concerns, the workspace is structured as follows. We utilize Riverpod for state management.

```
lib/
├── main.dart                             # App entry point (initializes Firebase, Riverpod ProviderContainer)
├── app.dart                              # Root MaterialApp (Theme configuration, localization, routing)
├── core/                                 # Shared cross-cutting components
│   ├── theme/
│   │   ├── colors.dart                   # Emerald Green (#008080), Pure White (#FFFFFF), Metallic Gold (#D4AF37)
│   │   ├── typography.dart               # Arab-friendly typography configuration (Amiri, Inter)
│   │   └── app_theme.dart                # Dark and Light ThemeData presets
│   ├── routing/
│   │   ├── app_router.dart               # GoRouter configuration with Auth guards
│   │   └── routes.dart                   # Route name constants
│   ├── constants/
│   │   └── firebase_constants.dart       # Firestore collection names, Storage paths
│   ├── services/
│   │   ├── notification_service.dart      # FCM handler
│   │   ├── ai_moderation_service.dart    # Client-side moderation wrapper
│   │   └── analytics_service.dart        # Firebase Analytics logger
│   └── widgets/
│       ├── custom_button.dart
│       ├── loading_indicator.dart
│       └── error_view.dart
│
└── features/                             # Feature-specific modules
    ├── auth/
    │   ├── data/
    │   │   ├── datasources/
    │   │   │   └── auth_remote_datasource.dart
    │   │   ├── models/
    │   │   │   └── user_model.dart
    │   │   └── repositories/
    │   │       └── auth_repository_impl.dart
    │   ├── domain/
    │   │   ├── entities/
    │   │   │   └── app_user.dart
    │   │   ├── repositories/
    │   │   │   └── auth_repository.dart
    │   │   └── usecases/
    │   │       ├── login_usecase.dart
    │   │       └── register_usecase.dart
    │   └── presentation/
    │       ├── controllers/
    │       │   └── auth_controller.dart      # StateNotifier or AsyncNotifier providers
    │       ├── screens/
    │       │   ├── login_screen.dart
    │       │   └── profile_register_screen.dart
    │       └── widgets/
    │           └── auth_text_field.dart
    │
    ├── feed/                                 # Home Feed (Quran, Hadith, Duas, Reminders)
    │   ├── data/
    │   │   ├── models/
    │   │   │   └── post_model.dart
    │   │   └── repositories/
    │   │       └── feed_repository_impl.dart
    │   ├── domain/
    │   │   ├── entities/
    │   │   │   ├── post.dart
    │   │   │   └── islamic_reaction.dart     # Ameen, Benefited, Learned, Inspired, JazakAllah
    │   │   └── usecases/
    │   │       ├── get_feed_usecase.dart
    │   │       └── react_to_post_usecase.dart
    │   └── presentation/
    │       ├── controllers/
    │       │   ├── feed_controller.dart
    │       │   └── post_action_controller.dart
    │       └── screens/
    │           ├── feed_screen.dart
    │           └── create_post_screen.dart
    │
    ├── reels/                                # Short Islamic Videos (Tafsir, Quran, reminders)
    │   ├── data/models/video_model.dart
    │   ├── domain/entities/reels_video.dart
    │   └── presentation/
    │       ├── controllers/reels_controller.dart
    │       └── screens/reels_viewer_screen.dart
    │
    ├── communities/                          # Islamic Study Circles, Quran/Hifz groups
    │   ├── data/models/community_model.dart
    │   ├── domain/entities/community.dart
    │   └── presentation/
    │       ├── controllers/community_controller.dart
    │       └── screens/community_home_screen.dart
    │
    ├── qa/                                   # Scholar Islamic Q&A
    │   ├── data/models/question_model.dart
    │   ├── domain/entities/question.dart
    │   └── presentation/
    │       ├── controllers/qa_controller.dart
    │       └── screens/qa_feed_screen.dart
    │
    ├── chat/                                 # Messaging
    │   ├── data/models/chat_room_model.dart
    │   ├── domain/entities/message.dart
    │   └── presentation/
    │       ├── controllers/chat_controller.dart
    │       └── screens/chat_room_screen.dart
    │
    └── profile/                              # Islamic profile, contribution score, badges
        ├── presentation/
        │   ├── controllers/profile_controller.dart
        │   └── screens/profile_screen.dart
        └── domain/entities/badge.dart
```

---

## 3. Complete Database Schema (Firestore Collections & Subcollections)

We design a flat-structured but query-optimized Firestore schema. Since Firestore handles nested shallow collections nicely, subcollections are widely utilized.

### Collection: `users`
**Document Path:** `/users/{userId}`
```json
{
  "uid": "user_id_abc123",
  "email": "abc@ummahconnect.com",
  "phoneNumber": "+919876543210",
  "displayName": "Amaan Mohd",
  "username": "amaan_mohd",
  "photoUrl": "https://gcs.ummahconnect/profiles/abc123_thumb.png",
  "bio": "Seeking Islamic Knowledge | High School Quran Teacher",
  "role": "scholar", // "user" | "moderator" | "scholar" | "admin"
  "isVerified": true,
  "contributionScore": 1240, // Points gained by beneficial posts/answers
  "badges": [
    "quran_learner", 
    "verified_scholar",
    "community_helper"
  ],
  "preferences": {
    "theme": "light",
    "language": "en",
    "isRtl": false,
    "fcmToken": "fcm_token_xyz"
  },
  "metrics": {
    "postsCount": 42,
    "followersCount": 1289,
    "followingCount": 352
  },
  "createdAt": "2026-05-30T04:35:00Z"
}
```

---

### Collection: `posts`
**Document Path:** `/posts/{postId}`
```json
{
  "id": "post_id_feed998",
  "authorId": "user_id_abc123",
  "authorName": "Amaan Mohd",
  "authorPhotoUrl": "https://gcs.ummahconnect/profiles/abc123_thumb.png",
  "authorRole": "scholar",
  "postType": "quran_reflection", // "text" | "image" | "video" | "quran_reflection" | "hadith" | "dua" | "daily_reminder"
  "content": "A beautiful reminder of Allah's mercy. Let us always turn to Him in ease and in hardship.",
  "arabicText": "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
  "translationText": "Therefore remember Me, I will remember you, and be thankful to Me, and do not be ungrateful to Me. (2:152)",
  "mediaUrl": "https://gcs.ummahconnect/images/reflection_image.jpg",
  "mediaType": "image", // "image" | "video" | "infographic" | "none"
  "tags": ["Mercy", "Remembers", "Quran2_152"],
  "likesCount": 1500, // Total reaction counts
  "reactionsCount": {
    "ameen": 84,
    "benefited": 120,
    "learned": 90,
    "inspired": 110,
    "jazakallah": 204
  },
  "commentsCount": 45,
  "sharesCount": 30,
  "isSticky": false, // Admins/Scolars can pin items
  "status": "active", // "active" | "draft" | "under_review" | "reported"
  "createdAt": "2026-05-30T04:35:00Z"
}
```

#### Subcollection: `posts/{postId}/comments`
**Document Path:** `/posts/{postId}/comments/{commentId}`
```json
{
  "id": "comment_987",
  "postId": "post_id_feed998",
  "authorId": "user_id_xyz",
  "authorName": "Omar Farooq",
  "authorPhotoUrl": "https://gcs.ummahconnect/profiles/xyz.png",
  "content": "JazakAllah Khair for this beautiful ayah!",
  "reactionsCount": { "ameen": 5, "benefited": 10 },
  "createdAt": "2026-05-30T04:40:00Z"
}
```

---

### Collection: `reels`
**Document Path:** `/reels/{reelId}`
```json
{
  "id": "reel_321",
  "authorId": "user_id_abc123",
  "title": "Tafsir of Surah Al-Fatiha in 60 seconds",
  "videoUrl": "https://gcs.ummahconnect/reels/tafsir_fatiha.mp4",
  "thumbnailUrl": "https://gcs.ummahconnect/reels/tafsir_fatiha_thumb.jpg",
  "durationSeconds": 59.5,
  "viewCount": 23450,
  "reactionsCount": {
    "ameen": 12,
    "benefited": 700,
    "learned": 500,
    "inspired": 340,
    "jazakallah": 890
  },
  "category": "tafsir", // "recitation" | "tafsir" | "seerah" | "motivation" | "reminder"
  "tags": ["Fatiha", "Quran", "Tafsir"],
  "createdAt": "2026-05-30T04:35:00Z"
}
```

---

### Collection: `communities`
**Document Path:** `/communities/{communityId}`
```json
{
  "id": "group_hifz_central",
  "name": "Global Hifz Circle",
  "description": "A group dedicated to helping brothers and sisters memorize the Holy Quran with high-quality revision tracking.",
  "privacyType": "public", // "public" | "private" | "moderated"
  "rules": [
    "Be respectful and encourage one another.",
    "Share only verified Quranic resources.",
    "Do not distribute promotional links."
  ],
  "creatorId": "user_id_abc123",
  "moderators": ["user_id_abc123", "mod_user_99"],
  "membersCount": 2450,
  "tags": ["Hifz", "Quran", "Memorization"],
  "bannerUrl": "https://gcs.ummahconnect/communities/hifz.jpg",
  "createdAt": "2026-05-30T04:35:00Z"
}
```

#### Subcollection: `communities/{communityId}/discuss`
Tracking forum posts inside structural communities.
**Document Path:** `/communities/{communityId}/discuss/{discussionId}`

---

### Collection: `qa` (Islamic Q&A Module)
**Document Path:** `/qa/{questionId}`
```json
{
  "id": "q_abc998",
  "inquirerId": "user_id_xyz",
  "title": "What are the recommended times for Tahajjud prayer?",
  "content": "Can you offer Tahajjud immediately after Isha or does it have to be after sleeping?",
  "isAnonymous": false,
  "categoryId": "fiqh_ibadah",
  "tags": ["Tahajjud", "Night Prayer", "Fiqh"],
  "upvotes": 42,
  "answersCount": 2,
  "hasVerifiedAnswer": true,
  "verifiedAnswerId": "ans_scholar_001",
  "createdAt": "2026-05-30T04:35:00Z"
}
```

#### Subcollection: `qa/{questionId}/answers`
**Document Path:** `/qa/{questionId}/answers/{answerId}`
```json
{
  "id": "ans_scholar_001",
  "questionId": "q_abc998",
  "authorId": "user_id_abc123", // Scholar's UID
  "authorName": "Sheikh Amaan Mohd",
  "authorRole": "scholar",
  "authorPhotoUrl": "https://gcs.ummahconnect/profiles/abc123_thumb.png",
  "content": "While Tahajjud is ideally offered during the last third of the night after waking up from sleep, scholars state that any prayer offered after Isha can be considered Tahajjud... (with Quran, Hadith proofs)",
  "references": [
    "Sahih Al-Bukhari 1147",
    "Surah Al-Isra 17:79"
  ],
  "isVerified": true, // Verified by the primary moderation panel/other scholars
  "upvotes": 120,
  "createdAt": "2026-05-30T04:55:00Z"
}
```

---

## 4. State Management Architecture (Riverpod)

Ummah Connect utilizes **Riverpod 2.0+** with the **Riverpod Generator** (`@riverpod` annotations) for reliable, robust, auto-disposing, and highly reactive state management.

### Key Providers

1. **Authentication Provider:**
   `AsyncValue<AppUser?>` tracking auth state and user roles.
2. **Feed Provider:**
   `NotifierProvider` returning a list of active posts, managing endless scrolling and state refresh.
3. **Comment/Reaction Multi-Provider:**
   Handles optimistic local UI updates for Islamic Reactions:
   * When a user taps "JazakAllahKhair", the count increments instantly in the UI with a gentle haptic buzz, while performing a background write to Firebase.

```dart
// Dart Code Example: Islamic Reaction State Pattern
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:ummah_connect/features/feed/domain/entities/post.dart';
import 'package:ummah_connect/features/feed/data/repositories/feed_repository.dart';

part 'reaction_controller.g.dart';

@riverpod
class ReactionController extends _$ReactionController {
  @override
  FutureOr<void> build() {}

  Future<void> triggerReaction({
    required String postId,
    required String reactionType, // "ameen" | "benefited" | "learned" | "inspired" | "jazakallah"
  }) async {
    state = const AsyncValue.loading();
    try {
      final repository = ref.read(feedRepositoryProvider);
      await repository.addReaction(postId: postId, reactionType: reactionType);
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
}
```

---

## 5. UI/UX Screens List (Premium Green, White, Gold Theme)

### Premium Design Parameters
*   **Colors Primary:** Deep Islamic Forest Green (`#0F5A47`), Mint Accents (`#ECFDF5`), Pure White (`#FFFFFF`).
*   **Color Elements:** Dark Charcoal Obsidian (`#0F172A`) for dark mode background. Soft Champagne Gold (`#DFB45E`) for premium badges, highlighted Quran text borders, and scholar verifications.
*   **Amiri & Inter Font Pairings:** Arabic texts are rendered in the elegant **Amiri** font with variable margins. Standard English instructions use **Inter** or **Space Grotesk** for modern display layouts.

### Screen Directory Matrix
1.  **Auth Stack:**
    *   `LoginScreen`: Clean minimalist login incorporating an elegant gold-plated greeting: "Connect with the Global Ummah".
    *   `ProfileSetupScreen`: Prompts username, bio, and initial study circles selection.
2.  **Dashboard Hub (Bottom Navigation Screen):**
    *   **Home Feed Tab**: Staggered feed of Quran reflections (Arabic + beautiful typography translation + gold divider lines), Hadith (Sahih references), daily reminders, and articles.
    *   **Reels Tab**: Fullscreen auto-playing reels with overlay reactions (Ameen, JazakAllahKhair vertically stacked on the right side).
    *   **Communities Tab**: Bento grid view with groups (`Central Hifz Circle`, `Reverts Hub`, `Fiqh 101`).
    *   **Islamic Q&A Tab**: Categorized Islamic question stream. Questions from users are colored in soft white/charcoal obsidian, and confirmed Scholar answers are framed with dual gold borders for authenticity.
    *   **Profile Tab**: Displaying Contribution score, learning tracks, and customized achievements badges (`Quran Learner`, `Teacher`).

---

## 6. Security Implementation: Firebase Firestore Rules

We secure users, posts, moderation logs, and private channels inside strict firestore rules.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function signedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isScholar() {
      return getUserRole() == 'scholar';
    }

    function isModerator() {
      return getUserRole() == 'moderator' || getUserRole() == 'admin';
    }

    // User profiles rules
    match /users/{userId} {
      allow read: if signedIn();
      allow create: if signedIn() && isOwner(userId);
      allow update: if signedIn() && isOwner(userId) && (
        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'isVerified'])
      ); // Users CANNOT change their role or verified state!
      allow delete: if isModerator();
    }

    // Feed Posts rules
    match /posts/{postId} {
      allow read: if signedIn();
      allow create: if signedIn() && request.resource.data.authorId == request.auth.uid;
      allow update: if signedIn() && (
        request.resource.data.authorId == request.auth.uid || 
        isModerator() ||
        // Allow updating reaction counters specifically
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['reactionsCount', 'likesCount'])
      );
      allow delete: if signedIn() && (resource.data.authorId == request.auth.uid || isModerator());
      
      // Comments nested rules
      match /comments/{commentId} {
        allow read: if signedIn();
        allow create, update: if signedIn() && request.resource.data.authorId == request.auth.uid;
        allow delete: if signedIn() && (resource.data.authorId == request.auth.uid || isModerator());
      }
    }

    // Reels rules
    match /reels/{reelId} {
      allow read: if signedIn();
      allow create: if signedIn() && (request.resource.data.authorId == request.auth.uid);
      allow update: if signedIn() && (request.resource.data.authorId == request.auth.uid || isModerator() || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['reactionsCount', 'viewCount']));
      allow delete: if signedIn() && (resource.data.authorId == request.auth.uid || isModerator());
    }

    // Scholar Q&A rules
    match /qa/{questionId} {
      allow read: if signedIn();
      allow create: if signedIn();
      allow update, delete: if signedIn() && (resource.data.inquirerId == request.auth.uid || isModerator());

      match /answers/{answerId} {
        allow read: if signedIn();
        // Only Verified Scholars can contribute answers to the scholar panel!
        allow create: if signedIn() && isScholar();
        allow update: if signedIn() && (resource.data.authorId == request.auth.uid || isModerator());
        allow delete: if isModerator();
      }
    }

    // Communities rules
    match /communities/{communityId} {
      allow read: if signedIn();
      allow create: if signedIn();
      allow update: if signedIn() && (resource.data.creatorId == request.auth.uid || resource.data.moderators.hasAny([request.auth.uid]) || isModerator());
      allow delete: if isModerator();
    }
  }
}
```

---

## 7. AI Moderation System Workflow

A zero-tolerance policy for duplicate content, fake religious quotes, or hate speech is preserved using an automated multi-step verification:

```
        USER SUBMITS POST ──► CLOUD FUNCTION INTERCEPTOR
                                   │
                                   ├──► runs Gemini API (Moderation Prompt)
                                   │     ├── Check: Is translation accurate?
                                   │     ├── Check: Is Hadith verified? (Muwatta/Bukhari references checks)
                                   │     └── Check: Toxicity / Spam Analysis
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │   Status Result     │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
              [Pass: Active]            [Fail: Under Review/Flagged]
           Rendered on Feed instantly    Quarantined in Moderation Admin Queue
```

---

## 8. State-to-UI Navigation Flow

```
                     ┌───────────────────────────┐
                     │ GoRouter: Route Guard?    │
                     └─────────────┬─────────────┘
                                   │
                    ┌──────────────┴──────────────┐
             [Unauthenticated]              [Authenticated]
                    ▼                             ▼
            ┌───────────────┐              ┌───────────────┐
            │  LoginScreen  │              │ DashboardHost │
            └───────────────┘              └───────┬───────┘
                                                   │
                            ┌──────────────────────┼──────────────────────┐
                            ▼                      ▼                      ▼
                   ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
                   │   HomeFeed     │     │  Scholar Q&A   │     │  Communities   │
                   └────────────────┘     └────────────────┘     └────────────────┘
```

---

## 9. Monolithic vs. Distributed Scalability Strategy
1. **Firestore Indexes Database Setup:**
   * Compound query dynamic indexes on `posts` collection optimized for feed retrieval:
     * `status` ASC, `createdAt` DESC
     * `authorId` ASC, `status` ASC, `createdAt` DESC
2. **CDN Distribution (Firebase Storage to Fastly/Firebase Hosting):**
   * Pre-packaged media formats (.m3u8, MPEG-DASH) using HLS protocol for streaming reels and live audio rooms to minimize high bandwidth cost from native Firestore storage references.

---

## 10. Implementation & Development Deployment Guide

### Phase 1: Local Environment Bootstrap
1. Install Flutter SDK (3.22.x or later).
2. Create project using the specific architecture package template:
   ```bash
   flutter create ummah_connect --org com.ummahconnect --platforms=android,ios
   ```
3. Add dependencies to `pubspec.yaml`:
   ```yaml
   dependencies:
     flutter:
       sdk: flutter
     flutter_riverpod: ^2.5.1
     riverpod_annotation: ^2.3.3
     go_router: ^14.2.0
     firebase_core: ^3.1.0
     firebase_auth: ^5.1.1
     cloud_firestore: ^5.0.1
     firebase_storage: ^12.0.1
     firebase_messaging: ^15.0.1
     google_sign_in: ^6.2.1
   ```
4. Run code generators:
   ```bash
   flutter pub run build_runner build --delete-conflicting-outputs
   ```

### Phase 2: Firebase Orchestration
1. Initialize a Google Cloud Project `/firebase-blueprint.json` database.
2. Setup authentication structures: Active Email Verification, dynamic Google OAuth login credentials.
3. Deploy Firestore Rules with strict controls for Scholars and Moderators.

This blueprint guarantees a modern, production-ready, beautiful, and secure architectural implementation for **Ummah Connect**.
