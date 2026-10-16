"use client";

import { createContext, use, useState, type ReactNode } from "react";
import Segmented from "./Segmented";

/** Prices are shown per ERE, or converted to per kWh with ERE_PER_KWH. */
export type Unit = "ere" | "kwh";

const UnitContext = createContext<{ unit: Unit; setUnit: (unit: Unit) => void }>({ unit: "ere", setUnit: () => {} });

/** Holds the unit setting for the hero and the chart. It starts at ERE on every visit, so the static page matches. */
export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<Unit>("ere");
  return <UnitContext value={{ unit, setUnit }}>{children}</UnitContext>;
}

export const useUnit = () => use(UnitContext);

/** Shows `ere` or `kwh` by the unit setting, so a server component can render both versions and leave the pick to the browser. */
export function ByUnit({ ere, kwh }: { ere: ReactNode; kwh: ReactNode }) {
  return useUnit().unit === "kwh" ? kwh : ere;
}

/** The ERE / kWh switch. Hidden without JS, where it couldn't do anything. */
export function UnitToggle({ label, units }: { label: string; units: Record<Unit, string> }) {
  const { unit, setUnit } = useUnit();
  return (
    <div className="[html:not([data-js])_&]:hidden">
      <Segmented
        label={label}
        options={[
          { key: "ere", label: units.ere },
          { key: "kwh", label: units.kwh },
        ]}
        selected={unit}
        onSelect={setUnit}
      />
    </div>
  );
}
