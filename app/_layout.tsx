import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

// 1. 在全域層級阻止啟動畫面自動隱藏，讓我們先準備好資源
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 2. 載入資源（此處預留了載入自定義字體的空間）
  const [loaded, error] = useFonts({
    // 未來如果你有下載字體檔放到 assets/fonts，可以在這裡引入：
    // 'CustomFont': require('../assets/fonts/CustomFont.ttf'),
  });

  // 3. 監聽資源載入狀態，完成後手動隱藏啟動畫面
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // 如果資源還沒載入完，先不渲染 UI，維持在啟動畫面
  if (!loaded && !error) {
    return null;
  }

  // 4. 回傳 Expo Router 的 Stack 導航，並隱藏所有預設的頂部標題列
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 宣告 (tabs) 作為我們的主要路由群組 */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}