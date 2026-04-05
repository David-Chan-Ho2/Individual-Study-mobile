import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DataItem from "@/components/data-item";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useLambdaData } from "@/hooks/use-lambda-data";
import { useCallback, useState } from "react";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, error, refetch } = useLambdaData();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading && <ActivityIndicator />}
          {error && (
            <ThemedView type="backgroundElement" style={styles.card}>
              <HintRow
                title="Error"
                hint={<ThemedText type="small">{error}</ThemedText>}
              />
            </ThemedView>
          )}
          {data?.items.map((item, index) => (
            <DataItem key={`${item.device}_${index}`} item={item} />
          ))}
          {data && (
            <HintRow
              title="Refresh"
              hint={
                <ThemedText type="small" onPress={refetch}>
                  tap to refetch
                </ThemedText>
              }
            />
          )}

          {Platform.OS === "web" && <WebBadge />}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.three,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  card: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
