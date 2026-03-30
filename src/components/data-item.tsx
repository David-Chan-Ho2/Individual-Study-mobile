import { StyleSheet, View } from "react-native";

import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import type { HvacPayload } from "@/types/hvac.types";

function val(n: number, unit = "") {
  return (
    <ThemedText type="small">
      {n}
      {unit}
    </ThemedText>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <ThemedText
        type="smallBold"
        themeColor="textSecondary"
        style={styles.sectionTitle}
      >
        {title.toUpperCase()}
      </ThemedText>
      {children}
    </View>
  );
}

export default function DataItem({ item }: { item: HvacPayload }) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="subtitle">{item.device}</ThemedText>
        <ThemedView
          type={
            item.system.state === "Running"
              ? "backgroundSelected"
              : "backgroundElement"
          }
          style={styles.badge}
        >
          <ThemedText type="smallBold">{item.system.state}</ThemedText>
        </ThemedView>
      </View>

      <HintRow
        title="Mode"
        hint={<ThemedText type="small">{item.system.mode}</ThemedText>}
      />
      <HintRow
        title="Diagnostic"
        hint={<ThemedText type="small">{item.system.diagnostic}</ThemedText>}
      />
      <HintRow title="Uptime" hint={val(item.uptime, "s")} />
      <HintRow title="Wi-Fi RSSI" hint={val(item.wifi_rssi, " dBm")} />

      {/* Temperatures */}
      <Section title="Temperatures">
        <HintRow
          title="Supply Air"
          hint={val(item.temperatures.supplyAirF, "°F")}
        />
        <HintRow
          title="Return Air"
          hint={val(item.temperatures.returnAirF, "°F")}
        />
        <HintRow
          title="Delta Temp"
          hint={val(item.temperatures.deltaTempF, "°F")}
        />
        <HintRow
          title="High Pressure Line"
          hint={val(item.temperatures.highPressureLineF, "°F")}
        />
        <HintRow
          title="Low Pressure Line"
          hint={val(item.temperatures.lowPressureLineF, "°F")}
        />
        <HintRow
          title="Low Side Sat"
          hint={val(item.temperatures.lowSideSatF, "°F")}
        />
        <HintRow
          title="High Side Sat"
          hint={val(item.temperatures.highSideSatF, "°F")}
        />
      </Section>

      {/* Pressures */}
      <Section title="Pressures">
        <HintRow
          title="Low Side"
          hint={val(item.pressures.lowSidePsi, " PSI")}
        />
        <HintRow
          title="High Side"
          hint={val(item.pressures.highSidePsi, " PSI")}
        />
        <HintRow title="Delta" hint={val(item.pressures.deltaPsi, " PSI")} />
      </Section>

      {/* Performance */}
      <Section title="Performance">
        <HintRow
          title="Superheat"
          hint={val(item.performance.superheatF, "°F")}
        />
        <HintRow
          title="Subcooling"
          hint={val(item.performance.subcoolingF, "°F")}
        />
      </Section>

      {/* Faults */}
      <Section title="Faults">
        <HintRow title="Count" hint={val(item.faults.count)} />
        <HintRow
          title="Diagnostic"
          hint={<ThemedText type="small">{item.faults.diagnostic}</ThemedText>}
        />
        {item.faults.codes.length > 0 && (
          <HintRow
            title="Codes"
            hint={
              <ThemedText type="small">
                {item.faults.codes.join(", ")}
              </ThemedText>
            }
          />
        )}
      </Section>

      {/* Validity */}
      <Section title="Validity">
        <HintRow
          title="All Temps Valid"
          hint={
            <ThemedText type="small">
              {item.validity.allTempsValid ? "Yes" : "No"}
            </ThemedText>
          }
        />
        <HintRow
          title="All Pressures Valid"
          hint={
            <ThemedText type="small">
              {item.validity.allPressuresValid ? "Yes" : "No"}
            </ThemedText>
          }
        />
      </Section>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
    alignSelf: "stretch",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  badge: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
  section: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  sectionTitle: {
    marginBottom: Spacing.one,
  },
});
