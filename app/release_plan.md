# Release plan

Ways to get the Eurojackpot Picker app onto phones, from cheapest to most involved.
All builds go through EAS (Expo's cloud build service), so no local Xcode or Android Studio is needed.
A free Expo account is enough for EAS itself.

## Before any build

1. Log in to Expo: `npx eas-cli@latest login`
2. Set up the project: `npx eas-cli@latest build:configure` (creates `eas.json` and links the project to your Expo account)
3. Set the app identifiers in `app.json` (`ios.bundleIdentifier`, `android.package`). EAS asks for them on the first build if they're missing.

## Option 1: Expo Go (current setup)

- **Cost:** free
- **Platforms:** iPhone and Android
- **How:** `npx expo start` in `app/`, scan the QR code with Expo Go
- **Limits:** only works while the dev server is running on your computer and the phone is on the same network. Background jackpot checks are less reliable than in a real build.

## Option 2: Android APK, just for you

- **Cost:** free
- **How:**
  1. Add a preview profile to `eas.json`:
     ```json
     "preview": {
       "android": {
         "buildType": "apk"
       }
     }
     ```
  2. Run `npx eas-cli@latest build -p android --profile preview`
  3. Open the APK link from the build page on the phone and install it (allow installs from unknown sources when asked).
- **Limits:** Android only. Updates mean rebuilding and reinstalling, or using `eas update` for JS-only changes.

## Option 3: iPhone, just for you

- **Cost:** Apple Developer Program, $99/year
- **How:** `npx eas-cli@latest build -p ios`, then install either:
  - directly on registered devices (ad hoc build; register the phone with `npx eas-cli@latest device:create`), or
  - through TestFlight: `npx eas-cli@latest submit -p ios`, then install from the TestFlight app.
- **Limits:** iOS won't install unsigned apps, so there's no free path besides Expo Go.

## Option 4: Google Play Store

- **Cost:** Google Play developer account, $25 one-time
- **How:** `npx eas-cli@latest build -p android` (produces an `.aab`), then `npx eas-cli@latest submit -p android`
- **Needs:** store listing (description, screenshots, icon), privacy policy URL, content rating questionnaire. New personal developer accounts may have to run a closed test with testers before going public.

## Option 5: Apple App Store

- **Cost:** Apple Developer Program, $99/year
- **How:** `npx eas-cli@latest build -p ios`, then `npx eas-cli@latest submit -p ios`, then submit for review in App Store Connect
- **Needs:** store listing, screenshots, privacy policy URL, privacy questions answered in App Store Connect
- **Risk:** Apple's review may question a lottery-related app. The app doesn't sell tickets or take money, which should keep it out of the gambling rules, but the reviewer decides.

## Notes for any public release

- The jackpot comes from an unofficial lotto.de endpoint (`src/jackpot.ts`). It can change without notice, which would silently break the alert.
- Replace the default Expo icon and splash screen in `assets/` before publishing to a store.
