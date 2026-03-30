export type HvacPayload = {
    device: string
    uptime: number
    wifi_rssi: number
    system: {
        state: "Running" | "Off"
        mode: string
        diagnostic: string
    }
    temperatures: {
        highPressureLineF: number
        lowPressureLineF: number
        supplyAirF: number
        returnAirF: number
        deltaTempF: number
        lowSideSatF: number
        highSideSatF: number
    }
    pressures: {
        lowSidePsi: number
        highSidePsi: number
        deltaPsi: number
    }
    performance: {
        superheatF: number
        subcoolingF: number
    }
    faults: {
        count: number
        diagnostic: string
        codes: string[]
    }
    validity: {
        allTempsValid: boolean
        allPressuresValid: boolean
    }
}
