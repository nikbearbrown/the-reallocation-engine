# Chapter 1 — Temperature and Thermal Energy

*Three quantities that feel like one, and the confusion that follows when you treat them that way.*

---

You step into the ocean off the coast of Maine in July. The water is 12°C. Painfully cold. You get home and step into a bathtub at 38°C. Comfortable. Warm. Exactly right.

Here is the fact that should bother you: the ocean contains vastly more thermal energy than your bathtub. By many orders of magnitude. The Atlantic has roughly $10^{46}$ water molecules, each carrying kinetic energy proportional to temperature. Your bathtub has maybe $10^{26}$. The ocean is thermally richer by a factor of roughly $10^{20}$ — and yet it feels cold, and the bathtub feels warm.

Your body does not sense thermal energy. It senses heat flow. And heat flow is driven not by how much thermal energy a system contains, but by the difference in temperature between that system and you. Your skin sits at about 33°C. The ocean at 12°C is colder than you, so energy flows out. The bathtub at 38°C is warmer, so energy flows in. The direction of flow has nothing to do with the ocean's enormous thermal wealth.

This is the distinction the chapter is about. Temperature, thermal energy, and heat are three different things. They feel like one thing in ordinary language — we use "hot" to mean all three simultaneously — and that linguistic sloppiness is the source of more errors in thermodynamics than almost anything else. Getting them straight here will make the rest of this book considerably easier.

---

## Temperature

Temperature is a number that describes how fast the molecules of a substance are moving, on average.

More precisely: temperature is proportional to the *average translational kinetic energy per molecule*. In three dimensions, the equipartition theorem assigns an average energy of $\frac{1}{2}k_BT$ to each independent translational degree of freedom. A molecule free to move in $x$, $y$, and $z$ has three such degrees of freedom, so its average translational kinetic energy is $\frac{3}{2}k_BT$. Setting that equal to $\frac{1}{2}m\langle v^2 \rangle$ and solving for $T$:

$$T = \frac{m \langle v^2 \rangle}{3 k_B}$$

where $k_B = 1.38 \times 10^{-23}$ J/K is the Boltzmann constant and $\langle v^2 \rangle$ is the mean squared speed of the molecules. This is not a postulate — it is derived from statistical mechanics, and we will rederive it properly in Chapter 4.

<!-- → [TABLE: Two-column comparison — Temperature vs. Thermal Energy. Rows: definition, scales with system size?, example quantities, what a thermometer measures. Use the chapter's ocean-vs-bathtub example as the concrete test case. reader should see exactly why "same temperature, different thermal energy" is not a contradiction.] -->

Two things in that formula are worth pausing on. The formula uses $\langle v^2 \rangle$, not $\langle v \rangle$. The mean of the squares is not the square of the mean, and the distinction turns out to matter a great deal once we look at the full speed distribution in Chapter 4. More importantly, temperature is a *per-molecule* quantity — it describes the average energy of one molecule, not the cumulative energy of all of them. That is why temperature is called an *intensive* variable: it does not depend on how much material you have. A thimble of water and a swimming pool at 20°C have the same temperature, despite one holding incomparably more thermal energy than the other.

We measure temperature on the Kelvin scale in thermodynamic equations, because the equations require an absolute zero. Absolute zero — $T = 0$ K — is the classical limit at which thermal motion ceases. Room temperature is about 293 K. Body temperature is 310 K. The conversion is simply $T(\text{K}) = T(°\text{C}) + 273.15$. Since 2019, the Boltzmann constant has been fixed by definition at $k_B = 1.380649 \times 10^{-23}$ J/K, which means temperature is now formally defined by fixing $k_B$ — a subtle conceptual inversion from the older approach, and a sign of how precisely we can now characterize molecular motion.

---

## Thermal energy

Thermal energy is the total internal kinetic energy of all the molecules in a system — their translational motion, their rotational tumbling, their vibrational stretching — plus the potential energy stored in the forces between them.

It is an *extensive* variable: it scales with the size of the system. Double the number of molecules at the same temperature and you double the thermal energy. For a monatomic ideal gas, where there are no rotational or vibrational modes and no intermolecular forces to speak of, the thermal energy is simply:

$$U = \frac{3}{2} N k_B T$$

For a diatomic gas at moderate temperatures — where rotational modes are active but vibrational modes have not yet been excited — each molecule has five active degrees of freedom instead of three, so:

$$U = \frac{5}{2} N k_B T$$

The factor in front is counting the number of independent ways the molecule can store energy. A nitrogen molecule moving through space can translate in three directions and rotate about two axes (rotation about the symmetry axis of a diatomic molecule contributes negligibly), giving five-halves. At high temperatures, vibrational modes wake up and contribute two more terms — one for kinetic energy along the bond, one for potential energy — pushing the coefficient toward $\frac{7}{2}$. The thermal energy of a real gas is richer than the simple formula suggests, and this will matter when we calculate heat capacities.

The relation $U = \frac{3}{2}Nk_BT$ holds both concepts in tension at once. $T$ is the intensive, per-molecule quantity. $N$ is the count that makes the total energy extensive. $k_B$ converts between them. A thermometer measures $T$. To know $U$ you need both $T$ and how much material you have. The ocean and the bathtub have the same relationship to this formula — dramatically different $N$, dramatically different resulting $U$ — and that is exactly why the ocean can be colder and yet hold so much more energy.

---

## Heat

Heat is energy in transit.

It is not a property stored inside a system — it is what happens at the boundary between two systems at different temperatures. When the ocean and your skin are in contact, energy crosses from the higher-temperature side to the lower. That crossing is heat. Once the energy has crossed and is stored in your body's molecules, it is thermal energy, not heat. The word "heat" properly names only the *flow*, not the thing being stored.

The sign convention throughout this book: $Q > 0$ when heat flows into the system, $Q < 0$ when it flows out. The internal energy of a system increases when heat enters and when work is done on it — that is the first law, which we take up in Chapter 5.

There are three mechanisms by which heat moves, and they are physically distinct.

**Conduction** moves heat through a material by molecular collision, without any bulk motion of the material itself. In the hotter region, molecules vibrate faster; they collide with their slower neighbors and transfer kinetic energy along the temperature gradient. The rate obeys Fourier's law: $dQ/dt = -kA\,(dT/dx)$, where $k$ is the thermal conductivity, $A$ is the cross-sectional area, and $dT/dx$ is the temperature gradient. Metals conduct well because free electrons carry energy efficiently alongside the atomic vibrations. Insulators — air, wood, aerogel — conduct poorly because neither electrons nor atomic structure can transport energy with any efficiency.

**Convection** moves heat by the bulk flow of a fluid. Hot fluid is less dense and rises; it carries thermal energy upward and is replaced by cooler fluid from below. This is why you stir a pot, why warm-air vents are more effective near the floor, and why wind chill matters on a cold day — moving air strips away the warm layer your skin has built up and replaces it with cold air that has to be warmed again.

**Radiation** moves heat as electromagnetic waves, requiring no material medium at all. Every object above absolute zero emits radiation. The total power emitted per unit area follows the Stefan-Boltzmann law:

$$P = \sigma A T^4$$

where $\sigma = 5.67 \times 10^{-8}$ W/(m²·K⁴). The $T^4$ dependence is steep: at room temperature, radiation is small compared to conduction and convection, but at high temperatures it dominates completely. The Sun, with a surface temperature near 5800 K, loses energy almost entirely by radiation. A human body at 310 K emits in the infrared — visible to a thermal camera but carrying far less power per unit area.

When an object is surrounded by an environment at temperature $T_\text{env}$, the net radiated power is:

$$P_\text{net} = \sigma A (T^4 - T_\text{env}^4)$$

It is the difference of fourth powers, not the difference of temperatures, that drives the net flow. That asymmetry will reappear when we discuss blackbody radiation.

<!-- → [IMAGE: Three-panel mechanism diagram — conduction (molecules passing energy through a solid lattice), convection (arrows showing rising warm fluid and descending cool fluid), radiation (wavy lines leaving a glowing object into vacuum). Each panel should label the driving quantity: temperature gradient, density difference, T⁴ emission.] -->

---

## The Zeroth Law

Before temperature can be used as a measurable quantity, we need to establish that it is a well-defined one.

The Zeroth Law of Thermodynamics states: if system A is in thermal equilibrium with system C, and system B is in thermal equilibrium with system C, then A and B are in thermal equilibrium with each other.

This sounds like logic. But it isn't only logic — it is a physical claim. Without the Zeroth Law, thermometry breaks down. When a thermometer placed in two separate objects reads the same value in both, we use that to infer those objects would be in equilibrium with each other. The Zeroth Law is what licenses that inference. It asserts that "same temperature" is a transitive relation — that the property being measured is genuinely shared, not merely a coincidence of a particular probe. Without transitivity, you could have $A = C$ and $B = C$ and $A \neq B$ in some physical sense. The equilibrium condition could depend on which two systems you chose to compare, and the thermometer would be useless.

The law was identified explicitly by Ralph Fowler in the 1930s and named "zeroth" because it is logically prior to the First and Second Laws, which had already been numbered. It is, in a sense, the law that makes the concept of temperature coherent rather than just convenient.

---

## Specific heat capacity

When heat flows into an object, the object's temperature rises. How much it rises per joule depends on the substance — specifically on its *specific heat capacity* $c$, defined through:

$$Q = mc\Delta T$$

Water has $c = 4186$ J/(kg·K). This is anomalously high. The reason is hydrogen bonding: water molecules form a network of hydrogen bonds with their neighbors, and energy goes not only into speeding up molecular motion but also into stretching and bending that network. More ways to store energy means more energy required per degree of temperature rise.

The consequences are large. Oceans moderate climate precisely because water can absorb or release enormous amounts of thermal energy with only modest changes in temperature. Coastal cities are milder than inland cities at the same latitude. The human body is about 60% water by mass — the high specific heat limits how rapidly metabolism can overheat or chill you.

<!-- → [TABLE: Specific heat capacities — water (4186), aluminum (900), iron (449), copper (385), air at constant pressure (~1005) J/(kg·K). Column for "mass needed to store 1 kJ at ΔT = 1°C" to make the contrast vivid.] -->

Compare water with metals: copper has $c = 385$ J/(kg·K); iron, 449; aluminum, 900. The same joule that raises a kilogram of water by 0.24°C raises a kilogram of copper by 2.6°C — more than ten times as much. This is why a metal pan heats to cooking temperature almost instantly while a pot of water takes minutes to boil, even though the burner delivers heat to both at comparable rates.

---

## Calorimetry

When two objects at different temperatures come into thermal contact inside an insulated system, heat flows from hot to cold until they reach a common equilibrium temperature $T_f$. Conservation of energy requires that the heat lost by the hotter object equal the heat gained by the cooler:

$$m_1 c_1 (T_1 - T_f) = m_2 c_2 (T_f - T_2)$$

Solving for $T_f$:

$$T_f = \frac{m_1 c_1 T_1 + m_2 c_2 T_2}{m_1 c_1 + m_2 c_2}$$

This is a weighted average of the initial temperatures, weighted by *heat capacity* $mc$ — not by mass alone. The object with the larger heat capacity pulls the equilibrium temperature toward its initial value. That is the central lesson, and it is worth working through concretely.

A 200 g copper block at 80°C is dropped into 500 g of water at 20°C:

$$(0.200)(385)(80 - T_f) = (0.500)(4186)(T_f - 20)$$

$$77(80 - T_f) = 2093(T_f - 20)$$

$$6160 - 77T_f = 2093T_f - 41860$$

$$48020 = 2170T_f \implies T_f \approx 22.1°\text{C}$$

The copper drops nearly 58°C. The water rises barely 2°C. This asymmetry is not primarily about size — it is about heat capacity. The water's heat capacity ($500 \times 4186 = 2093$ J/K) is 27 times the copper's ($200 \times 385 = 77$ J/K). The water barely registers the copper's thermal energy, because it requires so much more energy per degree to change temperature.

<!-- → [IMAGE: Thermal equilibration diagram — two vessels before and after contact. Left panel: copper block at 80°C, water at 20°C, arrow showing heat flow direction. Right panel: both at 22.1°C. Annotate the heat capacities (77 J/K vs 2093 J/K) so the reader sees why water wins the tug-of-war.] -->

This calculation assumes perfect insulation. Real calorimetry enforces this with insulated containers; high-precision work uses vacuum-jacketed Dewar flasks and accounts for the heat capacity of the container itself.

---

## Thermal expansion

As temperature rises, molecules move faster and vibrate more vigorously. In a solid, the intermolecular potential is asymmetric — molecules are easier to push apart than to compress — so the average separation grows with energy even though the *equilibrium* separation sits at the potential minimum. The macroscopic result is expansion.

For a linear dimension $L$:

$$\Delta L = \alpha L_0 \Delta T$$

where $\alpha$ is the linear thermal expansion coefficient. For steel, $\alpha \approx 12 \times 10^{-6}$/K; for aluminum, $\alpha \approx 23 \times 10^{-6}$/K.

A 10 m steel rail warming from 20°C to 50°C expands by $\Delta L = (12 \times 10^{-6})(10)(30) = 3.6$ mm. Negligible if unconstrained. But if the rail is bolted at both ends, that 3.6 mm of blocked expansion builds into a compressive stress of $\sigma = E\alpha\Delta T = (200 \times 10^9)(12 \times 10^{-6})(30) = 72$ MPa — roughly half the yield strength of structural steel. Bridges, railroad tracks, and highway slabs all require expansion joints. The gaps look incidental; they are doing serious structural work.

Water is the famous exception to the rule that substances expand uniformly with temperature. Between 0°C and 4°C, water *contracts* as it warms, reaching maximum density at exactly 4°C. Above 4°C it expands normally. The origin is hydrogen-bond geometry: ice has an open hexagonal lattice; as it melts, the lattice partially collapses and the molecules pack more tightly, temporarily outweighing the thermal expansion. The consequence is that ice is less dense than liquid water and floats. If ice sank, lakes would freeze from the bottom up, and aquatic life in cold climates would be far more precarious. The anomalous density maximum is one of the quiet structural features of Earth's biology.

<!-- → [CHART: Density of water vs. temperature from −5°C to 20°C — a curve showing the density maximum at 4°C. Mark the freezing point (0°C) and the density maximum (4°C). The non-monotonic shape is the whole point; the visual makes it immediately legible in a way prose alone cannot.] -->

---

## A note on what temperature is not

There is an old theory — the caloric theory, dominant in the eighteenth century — that heat was a weightless fluid called "caloric" that flowed from hot objects to cold ones and was conserved. It explained a great deal. It also predicted that you could squeeze heat out of a substance, the way you squeeze water from a sponge, and that cold was simply the *absence* of caloric.

Benjamin Thompson, known as Count Rumford, noticed in 1798 that boring cannon barrels generated heat indefinitely — which a finite caloric store could not explain. James Joule, in the 1840s, showed through careful mechanical experiments that work and heat were interconvertible at a fixed rate: heat was not a substance but a form of energy. The caloric theory was replaced by what we now call thermodynamics.

The reason I mention it: the intuition that cold is *something* — a substance, a presence rather than an absence — is remarkably persistent. Cold is the absence of thermal energy. There is no cold fluid, no cold caloric. When the ocean feels cold, what is actually happening is that energy is leaving your body. Cold is not entering; warmth is exiting. The direction of language and the direction of physics point the same way, if you follow the energy rather than the sensation.

<!-- → [IMAGE: Ocean vs. bathtub side-by-side comparison. Ocean panel: T = 12°C, N ~ 10⁴⁶ molecules, U ~ 10²³ J. Bathtub panel: T = 38°C, N ~ 10²⁶ molecules, U ~ 10⁶ J. Arrow labeled "heat flows this way" pointing from bathtub toward body, not from ocean toward body (even though ocean has 10¹⁷× more total energy). The visual makes the conceptual point unavoidable.] -->

---

## What comes next

Temperature describes average molecular speed — a per-molecule, intensive quantity. Thermal energy is the total stored in all the molecules — extensive, proportional to $N$. Heat is what flows when temperatures differ — a transfer, not a storage.

With these three concepts in hand, Chapter 2 looks more carefully at how heat flows: the mathematics of conduction, convection, and radiation, and what happens at phase boundaries where heat flows without any change in temperature at all. Chapter 4 derives the full distribution of molecular speeds — the Maxwell-Boltzmann distribution — which explains not just the average but the entire spread of velocities, including the tails that govern planetary atmospheres and chemical reaction rates.

---

## LLM Exercises

### Build the temperature-distribution visualizer (`01-temperature-kinetic.html`)

> **Show.** Maxwell-Boltzmann speed distribution: $f(v) = 4\pi (m/(2\pi k_B T))^{3/2} v^2 \exp(-mv^2/(2k_B T))$. Three characteristic speeds: most probable $v_{mp} = \sqrt{2k_BT/m}$, average $v_{avg} = \sqrt{8k_BT/(\pi m)}$, rms $v_{rms} = \sqrt{3k_BT/m}$.
>
> **Say.** Build a temperature + speed distribution visualizer with animated particles.
>
> **Constrain.** D3 v7. 2D box with N=100 particles colored by speed. Slider for T (50–2000 K) and molecular mass (selector for H₂=2, N₂=28, O₂=32, Ar=40). When T is changed, rescale all particle velocities accordingly. Below the box: a histogram of particle speeds updating in real time, with the analytical Maxwell-Boltzmann curve overlaid as a smooth line. Vertical markers at $v_{mp}, v_{avg}, v_{rms}$ with labels. Filename: `01-temperature-kinetic.html`.
>
> **Verify.** (a) Lower T: distribution narrows and shifts left. (b) Heavier molecule at same T: distribution narrows and shifts left. (c) $v_{mp} < v_{avg} < v_{rms}$ always (the distribution is asymmetric).

### Exploration

Compare H₂ and N₂ at the same temperature. H₂ is 14× lighter; its $v_{rms}$ is $\sqrt{14} \approx 3.7$× faster.

Raise T from 300 K to 1200 K. The distribution should broaden by a factor of 2 ($\sqrt{4}$).

What fraction of N₂ molecules at 300 K have $v > 1000$ m/s? Very small — the tail decays exponentially.

### Extension prompt (chapter bridge)

> **Show.** Different materials have different specific heats. Calorimetry: $Q_{\text{lost}} = Q_{\text{gained}}$ when systems reach equilibrium.
>
> **Say.** Build a calorimetry simulator: two substances in thermal contact, equilibrating over time.
>
> **Constrain.** Two boxes side by side, particles in each. Each box has its own initial $T_i$ and total energy. When the wall between them is "thermally conducting," energy flows: the hotter side's particles transfer energy to the cooler side via the boundary. Display each side's $T$ over time. They should converge to a common equilibrium $T_f$.
>
> **Verify.** $T_f$ matches the calorimetry calculation: $m_1 c_1 (T_1 - T_f) = m_2 c_2 (T_f - T_2)$.

Save as `01b-calorimetry-preview.html`. Bridge to Chapter 2.
