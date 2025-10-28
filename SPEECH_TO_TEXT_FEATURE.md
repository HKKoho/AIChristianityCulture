# Speech-to-Text Feature Documentation

## Overview

The application now supports **speech-to-text input** across all text input fields using the Web Speech API. Users can optionally use their device's microphone to dictate text instead of typing.

## Features

### 🎤 Universal Speech Input
- All text input fields now have a microphone button
- Click the microphone to start/stop voice dictation
- Supports Traditional Chinese (zh-TW) by default
- Visual feedback when recording (pulsing red button + "正在聆聽..." indicator)

### 🌐 Browser Support
The feature uses the **Web Speech API** which is supported in:
- ✅ Chrome/Edge (full support)
- ✅ Safari (full support)
- ⚠️ Firefox (limited support)
- ❌ Older browsers (gracefully degrades - mic button won't appear)

### 📍 Available Locations

Speech-to-text is available in the following components:

#### 1. **Theology Assistant** (`TheologyAssistant.tsx`)
- Chat message input (神學對話)
- Document Q&A input (上傳文檔簡閱或問答)
- Assignment topic input (作業主題)
- Assignment theology area input (神學領域)
- Resource search query input (資源搜尋)

#### 2. **Sermon Generator** (`InputForm.tsx`)
- Sermon topic input (主題)
- Key points input (鑰節或要點)

## Technical Implementation

### Core Components

#### 1. `useSpeechToText` Hook (`hooks/useSpeechToText.ts`)
Reusable React hook that provides speech recognition functionality:

```typescript
const {
  isListening,        // Boolean: currently recording
  isSupported,        // Boolean: browser supports API
  transcript,         // String: recognized text
  startListening,     // Function: start recording
  stopListening,      // Function: stop recording
  resetTranscript,    // Function: clear transcript
  error              // String: error message if any
} = useSpeechToText({
  lang: 'zh-TW',          // Language code
  continuous: false,       // Single utterance mode
  interimResults: true,    // Show partial results
  onResult: (text) => {}, // Callback for results
  onError: (err) => {}    // Callback for errors
});
```

#### 2. `SpeechInput` Component (`components/SpeechInput.tsx`)
Wrapper component that adds microphone button to standard inputs:

```typescript
<SpeechInput
  value={text}
  onChange={setText}
  placeholder="輸入文字..."
  lang="zh-TW"
  multiline={false}  // Use textarea if true
  rows={3}           // For multiline mode
  className="w-full"
/>
```

### Features

- **Automatic Appending**: Recognized speech is appended to existing text
- **Visual Feedback**:
  - Microphone button changes color when active (red with pulse animation)
  - "🎤 正在聆聽..." indicator below input
  - Error messages displayed when recognition fails
- **Disabled State Handling**: Mic button is disabled when input is disabled
- **Clean Integration**: Works seamlessly with existing onChange handlers

## Usage Guide

### For Users

1. **Starting Voice Input**:
   - Click the microphone icon (🎤) on any text input field
   - Wait for the "正在聆聽..." indicator to appear
   - Speak clearly into your device's microphone

2. **Stopping Voice Input**:
   - Click the microphone icon again (now showing 🔇)
   - Or simply stop speaking (auto-stops after silence)

3. **Tips for Best Results**:
   - Speak clearly and at a moderate pace
   - Use in a quiet environment
   - Grant microphone permissions when prompted
   - For Traditional Chinese, ensure proper pronunciation

### For Developers

#### Adding Speech Input to a New Component

1. Import the component:
```typescript
import SpeechInput from './SpeechInput';
```

2. Replace standard input:
```typescript
// Before:
<input
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="輸入文字..."
/>

// After:
<SpeechInput
  value={text}
  onChange={setText}
  placeholder="輸入文字..."
  lang="zh-TW"
/>
```

#### Customizing Language

Change the `lang` prop to support different languages:
```typescript
<SpeechInput lang="en-US" />  // English (US)
<SpeechInput lang="zh-CN" />  // Simplified Chinese
<SpeechInput lang="ja-JP" />  // Japanese
```

#### Multiline Support

For textarea-style inputs:
```typescript
<SpeechInput
  value={text}
  onChange={setText}
  multiline={true}
  rows={5}
  lang="zh-TW"
/>
```

## Browser Permissions

The feature requires microphone access. Users will see a browser permission prompt the first time they use voice input.

### Permission States:
- ✅ **Granted**: Voice input works normally
- ❌ **Denied**: Mic button appears but shows error when clicked
- ⚠️ **Not Supported**: Mic button doesn't appear at all

## Error Handling

The component handles various error scenarios gracefully:

| Error | User Experience |
|-------|----------------|
| Browser not supported | Mic button hidden, normal typing works |
| Permission denied | Error message: "無法啟動語音識別" |
| Network error | Error message with specific details |
| No speech detected | Stops listening automatically |

## Accessibility

- Mic button includes proper ARIA labels
- Title attributes provide hover tooltips
- Clear visual states for active/inactive
- Keyboard shortcuts not implemented yet (future enhancement)

## Future Enhancements

Potential improvements for future versions:

1. **Keyboard Shortcuts**: Hotkey to toggle voice input (e.g., Ctrl+Shift+V)
2. **Language Auto-Detection**: Automatically detect user's language
3. **Continuous Mode**: Keep listening without manual toggle
4. **Voice Commands**: Special commands like "new paragraph", "delete that"
5. **Offline Support**: Local speech recognition models
6. **Custom Vocabulary**: Train on theology-specific terms

## Testing

To test the feature:

1. **Browser Compatibility**: Test in Chrome, Safari, Firefox, Edge
2. **Permission Flows**: Test grant/deny scenarios
3. **Language Accuracy**: Test with various Chinese dialects
4. **Error Recovery**: Test microphone disconnection, permission revocation
5. **UI States**: Verify visual feedback in all states

## Performance

- **Minimal Overhead**: Hook only active when mic button is clicked
- **No External Dependencies**: Uses native Web Speech API
- **Lazy Loading**: Speech recognition instance created on demand
- **Cleanup**: Properly aborts recognition on component unmount

## Known Limitations

1. **Firefox Support**: Limited Web Speech API support
2. **Accuracy**: Depends on browser's recognition engine
3. **Privacy**: Audio is sent to browser's speech service (Google for Chrome)
4. **Network Required**: Most browsers require internet connection
5. **Dialect Variations**: May struggle with regional accents

## Support

For issues or questions about the speech-to-text feature:
- Check browser console for detailed error messages
- Verify microphone permissions in browser settings
- Ensure using a supported browser (Chrome/Safari recommended)
- Check internet connection for cloud-based recognition
