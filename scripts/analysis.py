"""All financial analysis and forward-looking content. Called by build_data.py; asserts stop a bad build."""

# Cash, bank and deposits: the printed Schedule 2.3 totals, which include deposits with LIC
CASH = {20: 987.37, 21: 978.24, 22: 1055.17, 23: 1512.83, 24: 2164.83, 25: 2873.61}
DEP = {20: 63.45, 21: 52.18, 22: 54.04, 23: 50.55, 24: 61.13, 25: 63.52}
ROCE = {20: 15.40, 21: 11.06, 22: 11.90, 23: 14.19, 24: 21.67, 25: 17.15}
DEBTOR_PCT = {17: 58.10, 18: 34.19, 19: 35.40, 20: 26.15, 21: 25.19, 22: 34.27, 23: 28.63, 24: 20.37, 25: 19.86}
# R5 cargo handling, R6 port & dock, R7 railway, R8 land & buildings, R9 management & admin
EXP = {16:(112.13,126.98,84.16,44.75,183.67),17:(94.90,117.55,84.80,46.17,188.23),18:(94.96,133.41,74.39,47.73,191.20),19:(113.08,133.22,105.99,40.13,198.59),
       20:(135.52,158.44,95.15,51.00,222.44),21:(153.11,144.87,90.34,43.29,222.53),22:(202.81,147.59,100.33,46.80,242.63),23:(180.14,191.72,113.10,52.24,260.84),
       24:(173.07,198.68,117.58,55.31,275.79),25:(172.36,186.63,137.26,67.15,238.32)}


def npv(rate, flows):
    return sum(f / (1 + rate) ** t for t, f in enumerate(flows))


def irr(flows):
    lo, hi = -0.9, 2.0
    if npv(lo, flows) * npv(hi, flows) > 0:
        return None
    for _ in range(200):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if npv(lo, flows) * npv(mid, flows) > 0 else (lo, mid)
    return lo


def payback(flows):
    total = 0
    for t, f in enumerate(flows):
        if total + f >= 0 and t:
            return round(t - 1 + -total / f, 1) if f else t
        total += f
    return None


def annuity(rate, n):
    return (1 - (1 + rate) ** -n) / rate


assert abs(npv(irr([-100, 60, 60]), [-100, 60, 60])) < 1e-6
assert payback([-100, 50, 100]) == 1.5


def analyse(years, bs):
    Y = {int(y["fy"][2:]): y for y in years}
    S = {int(b["fy"][2:]): b for b in bs}
    r = lambda x, n=2: None if x is None else round(x, n)

    expenditure = []
    for y, v in EXP.items():
        assert abs(sum(v) - Y[y]["operatingExpenditure"]) < 0.06, (y, sum(v), Y[y]["operatingExpenditure"])
        expenditure.append(dict(zip(("fy","cargoHandling","portDock","railway","landBuildings","management"), (f"FY{y}", *v))))

    cash_flow = []
    for y in range(21, 26):
        a, b = S[y - 1], S[y]
        capex = (b["netFixedAssets"] - a["netFixedAssets"]) + (b["capitalWIP"] - a["capitalWIP"]) + DEP[y]
        investing = -capex - (b["investments"] - a["investments"])
        financing = (b["grants"] - a["grants"]) + (b["netWorth"] - a["netWorth"] - Y[y]["pat"])
        change = CASH[y] - CASH[y - 1]
        cash_flow.append(dict(fy=f"FY{y}", operating=r(change - investing - financing), investing=r(investing), financing=r(financing),
                              netChange=r(change), closingCash=CASH[y]))

    ratios = []
    for y in sorted(Y):
        q, b, prev = Y[y], S.get(y), Y.get(y - 1)
        ratios.append(dict(fy=f"FY{y}", operatingRatioPct=q["operatingRatioPct"], patMarginPct=r(q["pat"] / q["operatingIncome"] * 100, 1),
            incomeGrowthPct=r((q["operatingIncome"] / prev["operatingIncome"] - 1) * 100, 1) if prev else None,
            surplusGrowthPct=r((q["operatingSurplus"] / prev["operatingSurplus"] - 1) * 100, 1) if prev else None,
            patGrowthPct=r((q["pat"] / prev["pat"] - 1) * 100, 1) if prev else None,
            cargoGrowthPct=r((q["cargoMMT"] / prev["cargoMMT"] - 1) * 100, 1) if prev and prev["cargoMMT"] else None,
            capexGrowthPct=r((q["capex"] / prev["capex"] - 1) * 100, 1) if prev and prev["capex"] else None,
            capexToSurplusPct=r(q["capex"] / q["operatingSurplus"] * 100, 1) if q["capex"] else None,
            rocePct=ROCE.get(y), debtorDays=r(DEBTOR_PCT[y] * 3.65, 0) if y in DEBTOR_PCT else None,
            currentRatio=r(b["currentRatioPct"] / 100) if b else None, assetTurnover=r(q["operatingIncome"] / b["totalAssets"]) if b else None,
            returnOnAssetsPct=r(q["pat"] / b["totalAssets"] * 100, 1) if b else None, returnOnNetWorthPct=r(q["pat"] / b["netWorth"] * 100, 1) if b else None,
            equityMultiplier=r(b["totalAssets"] / b["netWorth"]) if b else None, debtToEquity=0 if b and y >= 22 else None,
            cashRs=CASH.get(y)))

    # Appraisal A: what the FY17-FY25 capex programme returned, using actual figures only, no terminal value
    cases = []
    for share in (1.0, 0.5, 0.25):
        flows = [-Y[17]["capex"]] + [share * (Y[y]["operatingSurplus"] - Y[17]["operatingSurplus"]) - Y[y]["capex"] for y in range(18, 26)]
        gains = [share * (Y[y]["operatingSurplus"] - Y[17]["operatingSurplus"]) for y in range(18, 26)]
        spent = sum(Y[y]["capex"] for y in range(17, 26))
        disc = [f / 1.1 ** t for t, f in enumerate(flows)]
        i = irr(flows)
        cases.append(dict(attributionPct=int(share * 100), npvAt10=r(npv(.10, flows), 0), npvAt12=r(npv(.12, flows), 0), irrPct=r(i * 100, 1) if i is not None else None,
            arrPct=r(sum(gains) / len(gains) / spent * 100, 1), paybackYears=payback(flows), discountedPaybackYears=payback(disc),
            flows=[r(f, 1) for f in flows]))
    # Appraisal B: break-even for named projects. Only the cost is published.
    breakeven = [dict(project=n, costCr=c, needsPerYearCr=r(c / annuity(.10, 30), 1), needsPerYear12Cr=r(c / annuity(.12, 30), 1))
                 for n, c in (("WQ-7 and WQ-8 mechanisation", 288.47), ("EQ-7 mechanisation", 200.99), ("WQ-6 revamp", 165.70), ("Internal flyovers (proposed)", 334.89))]
    sens = [dict(ratePct=int(q * 100), npv30y={str(m): r(m * annuity(q, 30) - 288.47, 0) for m in (25, 30, 35, 40, 50)}) for q in (.08, .10, .12, .14)]
    assert abs(breakeven[0]["needsPerYearCr"] * annuity(.10, 30) - 288.47) < 0.5

    base = 91.17
    forecast = [dict(scenario=n, growthPct=g, note=t, mmt={f"FY{26 + k}": r(base * (1 + g / 100) ** k, 1) for k in range(0, 5)})
                for n, g, t in (("Slow", 1.9, "repeats FY25 growth"), ("Trend", 3.9, "repeats the FY17 to FY25 average"), ("Strong", 8.9, "repeats April to October 2026 growth"))]
    return dict(
        expenditure=expenditure, cashFlow=cash_flow, ratios=ratios,
        dupont=[dict(fy=x["fy"], margin=x["patMarginPct"], turnover=x["assetTurnover"], multiplier=x["equityMultiplier"], returnOnNetWorth=x["returnOnNetWorthPct"]) for x in ratios if x["assetTurnover"]],
        appraisal=dict(programme=cases, breakeven=breakeven, sensitivityWQ78=sens, discountRatePct=10, lifeYears=30),
        forecast=dict(baseYear="FY26", capacityMTPA=154.71, target="100 MMT in FY27", needPerMonth=9.11, averagePerMonth=7.78, scenarios=forecast))


COPY = {
 "welcome": dict(title="Visakhapatnam Port", line="Oil, ore and coal, on India's east coast."),
 "glance": dict(title="Port at a glance", line="One natural harbour. Thirty-one berths. 91 million tonnes a year."),
 "understand": dict(title="How it was built", line="From a manganese jetty in 1933 to ships of 200,000 tonnes."),
 "finance": dict(title="Financial intelligence", line="Income more than doubled in nine years. Borrowings are nil."),
 "swot": dict(title="SWOT", line="Rich and deep. Slow in places."),
 "explorer": dict(title="Cargo and connections", line="Oil comes in. Ore goes out."),
 "market": dict(title="Against its rivals", line="Better margins than Chennai. Slower ships than most."),
 "pulse": dict(title="What people say", line="The city talks about dust."),
 "pipeline": dict(title="What is coming", line="Berths, shipyards, hydrogen and a gigawatt of Google."),
 "research": dict(title="The research", line="What scholars have found here."),
 "next": dict(title="What to change", line="Four fixes, and the jobs around the port."),
 "depart": dict(title="", line=""),
}

READINGS = [  # one sentence each, shown beside its chart
 dict(id="income", title="Income and expenditure", text="Surplus rose from Rs 356 crore to Rs 1,314 crore while costs rose 45%."),
 dict(id="revenue", title="Where income comes from", text="Port and dock charges lead, at 45% of income."),
 dict(id="cost", title="Where money goes", text="Railway took its largest share since FY19, while rail tonnage fell."),
 dict(id="balance", title="Balance sheet", text="Net worth almost doubled in five years, with no borrowings from FY22."),
 dict(id="cash", title="Cash flow", text="Cash and deposits reached Rs 2,874 crore, almost three times FY20."),
 dict(id="capex", title="Capital expenditure", text="FY25 capex used only 18% of operating surplus."),
 dict(id="growth", title="Growth", text="FY25 stalled: cargo +1.9%, income +2.0%, profit -6.7%."),
 dict(id="ratios", title="Ratios", text="The operating ratio improved from 60.8% to 37.9%."),
 dict(id="appraisal", title="Investment appraisal", text="Did nine years of spending pay? Depends how much growth you credit to it."),
]

HIDDEN = [
 dict(name="Income per tonne", value="Rs 256", change="from Rs 150 in FY17", meaning="Price and mix beat volume"),
 dict(name="Oil dependence", value="30.1%", change="from 21.8% in FY23", meaning="One refinery matters more each year"),
 dict(name="Gulf exposure", value="18.6%", change="of overseas imports, FY25", meaning="Hormuz risk"),
 dict(name="Rail share", value="34.8%", change="from 46.3% in FY17", meaning="Less cargo moves by train"),
 dict(name="Total waiting", value="5.01 h", change="against 0.71 h charged to the port", meaning="The usual number hides most of the wait"),
 dict(name="Dues over five years", value="Rs 238 crore", change="57% of all dues, FY25", meaning="Profit quality"),
]

REGION = [
 dict(name="Google AI hub", status="under construction", what="Gigawatt-scale campus, US$15 billion, three sites, three subsea cables", when="Broke ground 28 April 2026; target July 2028", link="Cables land on the port's coast. No port cargo has been quantified.", sources=["dcd"]),
 dict(name="Digital Connexion (Reliance, Brookfield, Digital Realty)", status="announced", what="1 GW AI data centre campus, about US$11 billion", when="MoU; by 2030", link="Regional power and construction demand", sources=["tnm"]),
 dict(name="Sify data centre (Meta reported as tenant)", status="reported", what="500 MW campus and cable landing; some reports say 550 MW", when="Foundation planned for October 2025", link="Regional", sources=["outlook"]),
 dict(name="Cognizant campus", status="under construction", what="8,000 seats, Rs 1,583 crore", when="Broke ground December 2025; first phase early 2029", link="Skilled jobs", sources=["cognizant"]),
 dict(name="Alluri Sitarama Raju Airport, Bhogapuram", status="operational", what="New international airport for the city", when="Flights from 17 August 2026", link="Air cargo beside sea cargo", sources=["itln"]),
 dict(name="Ship Technology Centre", status="announced", what="Rs 305 crore research and design centre in Visakhapatnam", when="Announced 10 January 2026", link="Shipbuilding skills", sources=["air"]),
]

MOUS = [
 dict(date="Nov 2026", parties="Hindustan Shipyard and Cyient DLM", what="Indian-made marine electronics", value=None, sources=["hindu"]),
 dict(date="Nov 2026", parties="Andhra Pradesh, CII summit, day one", what="73 MoUs and 15 orders, statewide and not port-specific", value="Rs 5,84,355 crore", sources=["yocii"]),
 dict(date="Sep 2026", parties="Mazagon Dock and NSHIP-AP", what="Anchor shipyard at Dugarajapatnam", value="about Rs 15,000 crore", sources=["mdl"]),
 dict(date="Nov 2025", parties="VPA and Rail Vikas Nigam", what="Flyovers, bridges and port railways", value="Rs 535 crore", sources=["rvnl"]),
 dict(date="Oct 2025", parties="VPA and Andhra Pradesh", what="Dugarajapatnam port and shipbuilding cluster", value="Rs 29,662 crore", sources=["yomou"]),
 dict(date="Oct 2025", parties="VPA and MECON", what="Stackyards and railway sidings", value="Rs 3,000 crore", sources=["yomou"]),
 dict(date="Oct 2025", parties="VPA and NBCC", what="Development of Harbour Park land", value=None, sources=["yomou"]),
]

PAPERS = [
 dict(year=1988, title="Longshore sediment transport near Visakhapatnam Port", finding="Net sand drift runs north, with seasonal reversals", doi="10.1016/0951-8312(88)90031-8"),
 dict(year=2011, title="Littoral drift management: a success story of Visakhapatnam Port", finding="Sand trap and bypassing kept a 3 km beach", doi="10.1080/09715010.2011.10515048"),
 dict(year=2021, title="Specialization, ownership, competition and regulation: Indian seaports", finding="Competition from state ports hurts federal ports", doi="10.1057/s41278-021-00200-y"),
 dict(year=2023, title="Modeling challenges affecting the performance of major ports of India", finding="Visakhapatnam stayed on the efficient frontier, 2013 to 2020", doi=None),
 dict(year=2025, title="Anchoring Global Efficiency (ADBI)", finding="Credits leadership and process reform for the 2023 container jump", doi="10.56506/PQPB5379"),
]

SOURCES = {
 "dcd": ("DCD: Google breaks ground", "https://www.datacenterdynamics.com/en/news/google-breaks-ground-on-15bn-data-center-project-in-india/"),
 "tnm": ("The News Minute: Reliance-Brookfield", "https://www.thenewsminute.com/news/reliance-brookfield-joint-venture-to-invest-usd-11-billion-to-build-ai-data-centres-in-vizag"),
 "outlook": ("Outlook Business: Meta and Sify", "https://www.outlookbusiness.com/deeptech/meta-sify-technologies-to-set-up-gigantic-500mw-data-centre-in-vizag"),
 "cognizant": ("Cognizant, 12 Dec 2025", "https://news.cognizant.com/2025-12-12-Cognizant-breaks-ground-on-8000-seater-campus-in-Visakhapatnam"),
 "itln": ("ITLN: airport opens", "https://www.itln.in/aviation/alluri-sitarama-raju-international-airport-begins-commercial-operations-1360358"),
 "air": ("Akashvani, 10 Jan 2026", "https://newsonair.gov.in/union-minister-sarbananda-sonowal-lays-foundation-for-major-projects-at-visakhapatnam-port/"),
 "hindu": ("The Hindu: CII summit", "https://www.thehindu.com/news/national/andhra-pradesh/ap-attracts-major-investments-at-cii-summit-in-visakhapatnam/article71701918.ece"),
 "yocii": ("Yo! Vizag, 13 Nov 2026", "https://www.yovizag.com/cii-summit-73-mous-signed-on-first-day/"),
 "yomou": ("Yo! Vizag, 31 Oct 2025", "https://www.yovizag.com/visakhapatnam-port-authority-signs-rs-39216-cr-mous/"),
 "rvnl": ("RVNL on X", "https://x.com/RailVikas/status/1989232877725438337"),
}
