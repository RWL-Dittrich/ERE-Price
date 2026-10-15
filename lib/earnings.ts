// What charging at home earns: the figures behind the explainer's value card and calculator.

/**
 * EREs per kWh of grid electricity delivered in 2026, by the NEa formula:
 * 0.505 (CBS renewable share, two years before the delivery year) × 183 g/MJ (fossil reference) × 3.6 MJ/kWh ÷ 1000.
 * The renewable share changes every year. The explainer text and the YieldFormula illustration spell the formula
 * out as well, so update those together with this number.
 */
export const ERE_PER_KWH = 0.3327;

/** The example fee of a registration service provider (inboekdienstverlener) used in the copy and the calculator. */
export const EXAMPLE_FEE = 0.2;
