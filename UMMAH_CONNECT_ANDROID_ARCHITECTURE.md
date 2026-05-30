# Ummah Connect — Complete Native Android Application Architecture & Implementation Plan

This document serves as the high-level, production-ready architectural specification, directory structure, and code implementation plan for **Ummah Connect** on the **Native Android** platform. 

It specifies a state-of-the-art native architecture leveraging **Jetpack Compose**, **Material Design 3 (M3)**, **Kotlin Coroutines & Flow**, **Retrofit**, and **Hilt Dependency Injection**, completely integrated with **Firebase**.

---

## 1. High-Level Native Android Architecture

Ummah Connect follows official Android development recommendations by employing a **Layered Architecture** adhering to clean separation patterns:

```
                            ┌────────────────────────┐
                            │    UI Layer (Compose)  │
                            │  Screens, VMs, State   │
                            └───────────┬────────────┘
                                        │
                                        ▼
                            ┌────────────────────────┐
                            │      Domain Layer      │
                            │ UseCases, Repos, Models│ (Pure Kotlin - No Framework Dependency)
                            └───────────▲────────────┘
                                        │
                                        │ (Dependency Inversion)
                            ┌───────────┴────────────┐
                            │       Data Layer       │
                            │ ReposImpl, Sources, DB │ (Firebase, Room Database, API Client)
                            └────────────────────────┘
```

### Architectural Pillars
- **Unidirectional Data Flow (UDF)**: UI states are emitted from ViewModel as a single read-only stream (`StateFlow<UiState>`), and events/actions are propagated upward.
- **Offline-First Ready**: The Data layer contains a local cache powered by a **Room Database** synced securely with Firestore via background workers (`WorkManager`).
- **Dependency Injection**: Fully wired with **Dagger Hilt** for compile-time safe, modular injection.

---

## 2. Complete Android Directory Structure (Feature-by-Feature Modularization)

This project layout ensures high scalability, separating features so they can be easily run, debugged, and tested independently.

```
app/
├── src/
│   ├── main/
│   │   ├── AndroidManifest.xml                    # Main app configurations, services, permissions
│   │   ├── java/com/ummahconnect/app/
│   │   │   ├── UmmahApplication.kt                # Hilt-enabled Application file, sets up Firebase
│   │   │   ├── core/                              # Core packages shared across features
│   │   │   │   ├── di/
│   │   │   │   │   ├── FirebaseModule.kt          # Hilt module for Auth, Firestore, FCM
│   │   │   │   │   └── DatabaseModule.kt          # Hilt module for Room database instances
│   │   │   │   ├── theme/
│   │   │   │   │   ├── Color.kt                   # Islamic Forest Green, Champagne Gold, Pearl White
│   │   │   │   │   ├── Type.kt                    # Amiri font for Arabic, Inter for English/Urdu texts
Theme.kt                # Material 3 Light/Dark configurations
│   │   │   │   ├── navigation/
│   │   │   │   │   ├── AppNavigation.kt           # Navigation graph & Bottom Nav destinations
│   │   │   │   │   └── Screen.kt                  # Sealed class representing destinations
│   │   │   │   └── util/
│   │   │   │       ├── NetworkBoundResource.kt    # Flow utility for cache-then-network resource streams
│   │   │   │       └── Extensions.kt
│   │   │   │
│   │   │   └── features/                          # Feature modules
│   │   │       ├── auth/
│   │   │       │   ├── data/
│   │   │       │   │   ├── model/AppUser.kt
│   │   │       │   │   └── repository/AuthRepositoryImpl.kt
│   │   │       │   ├── domain/
│   │   │       │   │   ├── usecase/LoginUseCase.kt
│   │   │       │   │   └── repository/AuthRepository.kt
│   │   │       │   └── ui/
│   │   │       │       ├── AuthViewModel.kt
│   │   │       │       ├── LoginScreen.kt         # Jetpack Compose Login component
│   │   │       │       └── ProfileSetupScreen.kt
│   │   │       │
│   │   │       ├── feed/                          # Social Feed (Quran, Hadith, Duas)
│   │   │       │   ├── data/
│   │   │       │   │   ├── local/PostDao.kt       # Room Dao for caching posts
│   │   │       │   │   ├── model/PostEntity.kt    # Database model
│   │   │       │   │   └── repository/FeedRepositoryImpl.kt
│   │   │       │   ├── domain/
│   │   │       │   │   └── usecase/GetFeedUseCase.kt
│   │   │       │   └── ui/
│   │   │       │       ├── FeedViewModel.kt
│   │   │       │       ├── FeedScreen.kt          # Multi-item list (Ayat, Hadith cards)
│   │   │       │       └── CreatePostActivity.kt
│   │   │       │
│   │   │       ├── reels/                         # Short video reels
│   │   │       │   ├── ui/
│   │   │       │   │   ├── ReelsViewModel.kt
│   │   │       │   │   └── ReelsScreen.kt         # ExoPlayer vertical view-pager container
│   │   │       │
│   │   │       ├── communities/                  # Islamic circles & forums
│   │   │       │   ├── data/model/Community.kt
│   │   │       │   └── ui/
│   │   │       │       ├── CommunityViewModel.kt
│   │   │       │       └── CommunitiesScreen.kt
│   │   │       │
│   │   │       ├── qa/                            # Scholar Q&A
│   │   │       │   └── ui/
│   │   │       │       ├── QaViewModel.kt
│   │   │       │       └── QaScreen.kt
│   │   │       │
│   │   │       └── profile/                       # User Profiles & Achievements
│   │   │           └── ui/
│   │   │               ├── ProfileViewModel.kt
│   │   │               └── ProfileScreen.kt
│   │   │
│   │   └── res/                                   # Assets and XML resources
│   │       ├── values/
│   │       │   ├── strings.xml                    # Standard and RTL Urdu, Hindi, Arabic translation locales
│   │       │   └── themes.xml
│   │       └── font/
│   │           ├── amiri_regular.ttf              # Classic Arabic script style
│   │           └── inter_regular.ttf
│   │
│   └── build.gradle                               # Features & dependency declarations
```

---

## 3. Production Multi-Lingual & RTL Configuration

To fully support high-fidelity translations, we manage localized items inside separate XML files.

### 1. Classical English: `res/values/strings.xml`
```xml
<resources>
    <string name="app_name">Ummah Connect</string>
    <string name="welcome_message">Connect with the Global Ummah</string>
    <string name="sign_in_email">Sign In with Email</string>
    <string name="nav_home">Home</string>
    <string name="nav_reels">Reels</string>
    <string name="nav_communities">Communities</string>
    <string name="nav_profile">Profile</string>
    
    <!-- Islamic Reaction Strings -->
    <string name="react_ameen">Ameen</string>
    <string name="react_subhanallah">SubhanAllah</string>
    <string name="react_allahuakbar">Allahu Akbar</string>
    <string name="react_benefited">Benefited</string>
    <string name="react_jazakallah">JazakAllah Khair</string>
</resources>
```

### 2. Arabic Locale (RTL Enabled): `res/values-ar/strings.xml`
```xml
<resources>
    <string name="app_name">أمة كونكت</string>
    <string name="welcome_message">تواصل مع الأمة الإسلامية العالمية</string>
    <string name="sign_in_email">تسجيل الدخول بالبريد الإلكتروني</string>
    <string name="nav_home">الرئيسية</string>
    <string name="nav_reels">مقاطع</string>
    <string name="nav_communities">المجتمعات</string>
    <string name="nav_profile">الملف الشخصي</string>
    
    <!-- Islamic Arabic Reactions -->
    <string name="react_ameen">آمين</string>
    <string name="react_subhanallah">سبحان الله</string>
    <string name="react_allahuakbar">الله أكبر</string>
    <string name="react_benefited">استفدت</string>
    <string name="react_jazakallah">جزاك الله خيراً</string>
</resources>
```

---

## 4. Jetpack Compose UI Models & UI Code Snippet

### Data Model: `Post.kt`
This model defines a multi-format feed post designed for beautiful UI presentation.

```kotlin
package com.ummahconnect.app.features.feed.domain.model

import java.util.Date

enum class PostType {
    QURAN_REFLECTION, HADITH, DUA, ISLAMIC_KNOWLEDGE, RE Reminder
}

data class Post(
    val id: String = "",
    val authorId: String = "",
    val authorName: String = "",
    val authorPhotoUrl: String = "",
    val authorRole: String = "user", // "user" | "scholar" | "moderator"
    val isAuthorVerified: Boolean = false,
    val type: PostType = PostType.ISLAMIC_KNOWLEDGE,
    val textContent: String = "",
    val arabicContent: String? = null,
    val referenceText: String? = null, // e.g., "Quran 2:255" or "Sahih Al-Bukhari 4"
    val tags: List<String> = emptyList(),
    val ameenCount: Int = 0,
    val subhanAllahCount: Int = 0,
    val allahuAkbarCount: Int = 0,
    val benefitedCount: Int = 0,
    val jazakAllahCount: Int = 0,
    val commentsCount: Int = 0,
    val createdAt: Date = Date()
)
```

---

### Jetpack Compose Layout: `FeedCard.kt` (Material 3 Gold & Emerald Styling)

This card incorporates fine Arabic display typography, customized Islamic reaction elements, and verified Scholar borders.

```kotlin
package com.ummahconnect.app.features.feed.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.ummahconnect.app.R
import com.ummahconnect.app.features.feed.domain.model.Post
import com.ummahconnect.app.features.feed.domain.model.PostType

// Colors Configured for M3 Light/Dark Themes
val DeepForestGreen = Color(0xFF0F5A47)
val MintLight = Color(0xFFECFDF5)
val GoldChampagne = Color(0xFFDFB45E)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeedCard(
    post: Post,
    onReactionTapped: (String, String) -> Unit, // (postId, reactionType)
    modifier: Modifier = Modifier
) {
    // If the author is a verified scholar, apply a premium thin gold border accent
    val borderStroke = if (post.authorRole == "scholar") {
        BorderStroke(1.5.dp, GoldChampagne)
    } else {
        BorderStroke(0.5.dp, MaterialTheme.colorScheme.outlineVariant)
    }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        shape = RoundedCornerShape(16.dp),
        border = borderStroke
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header: Author details
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                AsyncImage(
                    model = post.authorPhotoUrl,
                    contentDescription = "User Avatar",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                )

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = post.authorName,
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        if (post.isAuthorVerified) {
                            Spacer(modifier = Modifier.width(4.dp))
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = "Verified Profile",
                                tint = if (post.authorRole == "scholar") GoldChampagne else DeepForestGreen,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                    Text(
                        text = post.authorRole.replaceFirstChar { it.uppercase() },
                        style = MaterialTheme.typography.bodySmall,
                        color = if (post.authorRole == "scholar") GoldChampagne else MaterialTheme.colorScheme.outline
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Body: Islamic Content Type Specific Styling
            post.arabicContent?.let { arabic ->
                Text(
                    text = arabic,
                    style = MaterialTheme.typography.bodyLarge.copy(
                        fontFamily = FontFamily(Font(R.font.amiri_regular)),
                        fontSize = 22.sp,
                        lineHeight = 32.sp,
                        textDirection = TextDirection.Rtl
                    ),
                    textAlign = TextAlign.Right,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 8.dp)
                )
            }

            Text(
                text = post.textContent,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            post.referenceText?.let { ref ->
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "— $ref",
                    style = MaterialTheme.typography.bodySmall,
                    color = DeepForestGreen,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.End
                )
            }

            // Divider before Engagement Panel
            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
            Spacer(modifier = Modifier.height(8.dp))

            // Islamic Reaction Cluster Panel (Horizontal Scrolling Container)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Button 1: Ameen
                ReactionItem(
                    emoji = "🤲",
                    label = "Ameen",
                    count = post.ameenCount,
                    onClick = { onReactionTapped(post.id, "ameen") }
                )
                // Button 2: SubhanAllah
                ReactionItem(
                    emoji = "✨",
                    label = "SubhanAllah",
                    count = post.subhanAllahCount,
                    onClick = { onReactionTapped(post.id, "subhanallah") }
                )
                // Button 3: JazakAllah
                ReactionItem(
                    emoji = "⭐",
                    label = "JazakAllah",
                    count = post.jazakAllahCount,
                    onClick = { onReactionTapped(post.id, "jazakallah") }
                )
            }
        }
    }
}

@Composable
fun ReactionItem(
    emoji: String,
    label: String,
    count: Int,
    onClick: () -> Unit
) {
    TextButton(
        onClick = onClick,
        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(text = emoji, fontSize = 16.sp)
            Spacer(modifier = Modifier.width(4.dp))
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = label, 
                    style = MaterialTheme.typography.bodySmall,
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.primary
                )
                if (count > 0) {
                    Text(
                        text = "$count",
                        style = MaterialTheme.typography.bodyMedium,
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}
```

---

## 5. Offline Caching with Jetpack Room & Repository Pattern

We use Kotlin Flows combined with Room to deliver instantly visible cached updates.

### Room Entity: `CachedPost.kt`
```kotlin
package com.ummahconnect.app.features.feed.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.ummahconnect.app.features.feed.domain.model.PostType

@Entity(tableName = "cached_posts")
class CachedPost(
    @PrimaryKey val id: String,
    val authorId: String,
    val authorName: String,
    val authorPhotoUrl: String,
    val authorRole: String,
    val isAuthorVerified: Boolean,
    val type: String,
    val textContent: String,
    val arabicContent: String?,
    val referenceText: String?,
    val ameenCount: Int,
    val subhanAllahCount: Int,
    val jazakAllahCount: Int,
    val createdAt: Long
)
```

---

## 6. Dependency Injection Setup (Hilt)

### DI Provider: `FirebaseModule.kt`
Dynamically instantiates core Firestore services safely inside dependency injections:

```kotlin
package com.ummahconnect.app.core.di

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.storage.FirebaseStorage
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object FirebaseModule {

    @Provides
    @Singleton
    fun provideFirebaseAuth(): FirebaseAuth = FirebaseAuth.getInstance()

    @Provides
    @Singleton
    fun provideFirestore(): FirebaseFirestore = FirebaseFirestore.getInstance()

    @Provides
    @Singleton
    fun provideFirebaseStorage(): FirebaseStorage = FirebaseStorage.getInstance()

    @Provides
    @Singleton
    fun provideFirebaseMessaging(): FirebaseMessaging = FirebaseMessaging.getInstance()
}
```

---

## 7. AI Moderation Flow & API Layer

To satisfy high accuracy references (Quran citations & Hadith verification), requests pass through a Firebase Function running the Google Gemini models.

### API Proxy Model Representation:
- If a post starts with standard Islamic citations, it runs semantic analysis against verified databases (e.g. Leeds Quran Corpus & Sahih Bukhari registers).
- Content violating guidelines (sectarian disputes, toxic arguments, spam copy-pastes) triggers a client-side warning before blocking the database transaction.

---

## 8. Development & Publish Guide (Google Play Console Release)

1. **Gradle Build Verification:** Ensure optimization options are enabled via `proguard-rules.pro` inside release parameters to minify files and guarantee optimal device battery footprint.
2. **Setup SHA-256 Keys:** Export signature keys from Google Play Console to Firebase settings to secure Google Auth & Phone Login APIs.
3. **App Bundle generation:** Run:
   ```bash
   ./gradlew bundleRelease
   ```
4. Upload `app-release.aab` safely inside the console.

**Ummah Connect Native Android Client** is designed to satisfy high-performance limits, beautiful spiritual user interfaces, and modular scalability under professional standard guidelines.
