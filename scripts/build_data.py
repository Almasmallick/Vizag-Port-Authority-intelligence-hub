"""Builds src/content/site-data.json; fails if any control total breaks. Run: py -I scripts/build_data.py"""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import analysis as an

# FY: cargo, R1 cargo handling, R2 port & dock, R3 rail, R4 estate, opex, fin inc, fin exp, PBT, PAT, TEU, rail MMT, PPP MMT, capex
R = {
16: (None,384.47,270.81,153.79,98.46,551.69,341.91,672.07,25.68,50.06,None,None,None,None),
17: (61.02,302.57,336.67,124.71,153.62,531.64,122.63,463.26,45.32,23.04,367199,28.27,None,352.25),
18: (63.54,373.71,373.97,152.69,163.44,541.70,133.57,396.16,259.53,195.87,388624,27.60,None,277.01),
19: (65.30,414.68,398.32,161.18,227.21,591.01,99.42,508.89,200.91,124.51,450460,27.54,None,146.18),
20: (72.72,514.44,501.28,176.24,212.23,662.55,107.65,543.45,305.83,274.40,503630,32.13,37.58,100.28),
21: (69.84,550.96,541.88,141.45,211.40,654.15,78.16,464.39,405.30,238.64,481072,32.38,33.05,189.65),
22: (69.03,623.81,521.61,146.77,233.70,740.16,83.97,506.84,362.86,275.56,511794,30.86,34.85,339.45),
23: (73.75,647.57,683.66,155.95,239.68,798.03,135.69,533.31,531.20,380.71,522119,31.47,34.05,269.84),
24: (81.09,727.16,928.27,173.11,246.20,820.42,359.44,560.26,1053.51,724.27,672629,32.12,37.13,326.05),
25: (82.62,738.69,959.40,150.41,266.77,801.73,337.56,654.92,996.18,675.41,618093,28.75,37.01,240.06),
}

def rd(x, n=2):
    return None if x is None else round(x, n)

years = []
for y, (c,a,b,r,e,ox,fi,fe,pbt,pat,teu,rail,ppp,cap) in R.items():
    oi = a + b + r + e
    assert abs(oi - ox + fi - fe - pbt) < 0.08, (y, oi, pbt)
    years.append(dict(fy=f"FY{y}", cargoMMT=c, operatingIncome=rd(oi), cargoHandling=a, portDock=b, railway=r, estate=e,
        operatingExpenditure=ox, operatingSurplus=rd(oi-ox), financeMiscIncome=fi, financeMiscExpenditure=fe, pbt=pbt, pat=pat,
        teu=teu, railMMT=rail, pppMMT=ppp, capex=cap,
        incomePerTonne=rd(oi/c*10,0) if c else None, opexPerTonne=rd(ox/c*10,0) if c else None,
        surplusPerTonne=rd((oi-ox)/c*10,0) if c else None, operatingRatioPct=rd(ox/oi*100,1),
        railSharePct=rd(rail/c*100,1) if rail else None, pppSharePct=rd(ppp/c*100,1) if ppp else None))

# FY: net fixed assets, capital WIP, investments, current assets + loans, deferred tax asset, net worth, grants, deferred tax liability
B = {20:(1905.15,175.94,508.98,2253.30,154.56,2578.06,20.35,0), 21:(1865.17,237.54,519.47,2312.76,0,2872.72,21.27,12.10),
     22:(1938.71,322.67,528.41,2717.34,21.61,3146.81,42.18,0), 23:(2103.64,327.04,530.01,3296.08,42.57,3527.74,54.07,0),
     24:(2287.83,335.74,527.40,4275.58,70.03,4251.86,23.96,0), 25:(2347.11,406.07,539.87,5315.71,92.59,4926.90,48.96,0)}
bs = []
for y, (f,w,i,ca,dta,nw,g,d) in B.items():
    t = f + w + i + ca + dta
    cl = t - nw - g - d
    bs.append(dict(fy=f"FY{y}", netFixedAssets=f, capitalWIP=w, investments=i, currentAssetsAndLoans=ca, deferredTaxAsset=dta,
        totalAssets=rd(t), netWorth=nw, grants=g, deferredTaxLiability=d, currentLiabilitiesAndProvisionsDerived=rd(cl), currentRatioPct=rd(ca/cl*100,1)))
for b, pub in zip(bs[4:], (3220.74, 3725.49)):
    assert abs(b["currentLiabilitiesAndProvisionsDerived"] - pub) < 0.05, b

names = ["Petroleum, oil & gas (POL)","Iron ore & pellets","Coking coal","Steam coal","Thermal coal","Finished fertiliser","Fertiliser raw material (dry)","Containers","Other"]
com = {"FY23":[160.97,144.08,49.07,117.07,11.29,14.34,14.05,84.60,142.03], "FY24":[189.83,155.87,64.59,98.13,0,17.39,17.82,110.77,156.50],
       "FY25":[248.49,115.73,60.06,89.16,0,12.82,16.54,99.40,184.03]}
tot = {"FY23":737.50,"FY24":810.90,"FY25":826.23}
commodities = {}
for y, v in com.items():
    assert abs(sum(v) - tot[y]) < 0.01
    commodities[y] = [dict(name=n, mmt=rd(x/10), sharePct=rd(x/tot[y]*100,1)) for n, x in zip(names, v)]

imp = [("Russia",92.01),("South Africa",64.73),("Indonesia",44.59),("Australia",36.81),("United Arab Emirates",35.78),("Iraq",29.09),("United States",28.61),("Nigeria",18.10),("China",17.74),("Saudi Arabia",15.16),("Gabon",14.06),("Qatar",8.75),("Guinea",8.71),("Malaysia",7.70),("Sri Lanka",7.64),("Oman",7.25),("Mozambique",6.87),("Kuwait",6.80),("Togo",5.86),("Algeria",5.41)]
exp = [("Malaysia",26.59),("Sri Lanka",19.04),("China",16.27),("Singapore",14.60),("Oman",6.47),("United Kingdom",4.01),("Benin",3.93),("Cote d'Ivoire",2.98),("United Arab Emirates",2.68),("Russia",2.49),("Italy",2.46),("Qatar",2.34),("South Korea",1.87),("Egypt",1.80),("Togo",1.27),("Bangladesh",1.24),("Senegal",1.22),("United States",1.21)]
def trade(rows, total):
    return [dict(country=n, mmt=rd(v/10), sharePct=rd(v/total*100,1)) for n, v in rows]

I, O, V = "Inner", "Outer", "VPA"
berths = [dict(zip(("name","draftM","loaM","occupancyPct","operator","harbour"), t)) for t in [
 ("EQ-1",14.5,240,26,V,I),("EQ-2/EQ-3",14.5,240,86,V,I),("EQ-4/EQ-5",None,None,84,V,I),("EQ-6",12.5,240,87,V,I),("EQ-7",14.5,240,87,V,I),
 ("WQ-1",14.0,240,71,V,I),("WQ-2",13.5,240,65,V,I),("WQ-3",13.5,240,73,V,I),("WQ-4",11.5,240,53,V,I),("WQ-5",11.5,240,27,V,I),
 ("WQ-6",14.5,230,68,V,I),("WQ-7",14.5,240,72,V,I),("WQ-8",14.5,240,68,V,I),("OR-1",11.0,195,81,V,I),("OR-3",10.5,160,41,V,I),
 ("Fertiliser berth",10.06,200,28,V,I),("EQ-8",14.5,235,57,"Vizag Seaport",I),("EQ-9",14.5,235,60,"Vizag Seaport",I),
 ("EQ-10",11.0,160,6,"AVR Infra (reported terminated later)",I),("Offshore tanker terminal",17.0,280,44,V,O),("LPG berth",14.0,230,75,V,O),
 ("Cruise terminal",8.5,300,None,V,O),("VGCB coal terminal",18.1,300,63,"Vizag General Cargo Berth",O),
 ("Ore berths 1 & 2",None,300,65,"Essar Vizag Terminals",O),("Container terminal 1-2",16.0,390,58,"Visakha Container Terminal",O),
 ("Container terminal 3-4",16.0,390,50,"Visakha Container Terminal",O)]]

VPA_AR = "https://vpt.shipping.gov.in/Template/navigateTemplate/gnt/QW5udWFsIFJlcG9ydA=="
PIB = "https://www.pib.gov.in/PressReleasePage.aspx?PRID="
src = {
**an.SOURCES,
"admin25":("VPA Administration Report, Annual Accounts and Audit Report 2024-25",VPA_AR),
"accounts":("VPA audited annual accounts, 2015-16 to 2024-25",VPA_AR),
"pib1112":("Press Information Bureau, 12 Nov 2026",PIB+"2335584"),
"pib1111":("Press Information Bureau, 11 Nov 2026",PIB+"2335212"),
"bulletin":("Ministry of Ports: cargo at major ports, October 2026 (advance estimates)","https://shipmin.gov.in/"),
"update25":("Update on Indian Port Sector, 31 Mar 2025","https://shipmin.gov.in/sites/default/files/Update%20on%20Indian%20Ports%20Sector%20upto%2031.03.2025_0.pdf"),
"updateH1":("Update on the Indian Port Sector, Apr-Sep 2025","https://shipmin.gov.in/sites/default/files/Update%20on%20the%20Indian%20Port%20Sector%20April-Sept%202025.%20%281%29.pdf"),
"mopsw26":("Ministry of Ports, Annual Report 2025-26","https://shipmin.gov.in/sites/default/files/Annual%20Report%202025-26%20english.pdf"),
"cppi":("World Bank, Container Port Performance Index 2025","https://openknowledge.worldbank.org/bitstreams/c22815ce-b747-4e58-892b-3f0f04dcf4d1/download"),
"cppi23":("World Bank, CPPI 2023 press release","https://www.worldbank.org/en/news/press-release/2024/06/01/regional-disruptions-drive-changes-in-global-container-port-performance-ranking"),
"hpcl":("HPCL refineries","https://www.hindustanpetroleum.com/hp-refineries"),
"gpl":("Adani Gangavaram Port Ltd, FY26 accounts","https://www.adaniports.com/-/media/Project/Ports/Investors/FY25-26/Adani-Gangavaram-Port-Limited.pdf"),
"gplops":("Adani Ports, FY26 operational performance","https://www.adaniports.com/digital-reports/ports/2026/operational-performance-ports.html"),
"mdl":("Mazagon Dock Shipbuilders, 18 Sep 2026","https://mazagondock.in/images/pdf/V1_Press%20Release%20AP.pdf"),
"dgma":("DGMA: Dugarajapatnam cluster","https://dgma.gov.in/naval-architecture/greenfield-clusters/greenfield-shipbuilding-clusters-andhra-pradesh-dugarajapatnam"),
"ngel":("NTPC Green Energy: hydrogen hub","https://www.ngel.in/page/hydrogen-hub"),
"amns":("Environmental clearance, AM/NS Rajayyapeta, 20 Mar 2026","https://www.amns.in/storage/statutory-documents/March2026/EC_8_2_MTPA_ISP_Rajayapetta.pdf"),
"amnsport":("India Seatrade News: AM/NS captive port","https://indiaseatradenews.com/andhra-pradesh-cabinet-approves-captive-port-for-arcelormittal-nippons-steel-plant-in-anakapalli-district/"),
"circ":("VPA Circular 1993/2026, 28 Sep 2026","https://vpt.shipping.gov.in/admin_assets/uploads/1791287799_Circular_No_1993_Control_of_dust_pollution_during_cargo_handli.pdf"),
"projects":("VPA: ongoing infrastructure projects","https://vpt.shipping.gov.in/Template/navigateTemplate/gnt/T25nb2luZyBJbmZyYSBQcm9qZWN0cw=="),
"tnie":("New Indian Express, 31 Aug 2026","https://www.newindianexpress.com/states/andhra-pradesh/2026/Aug/31/three-key-ports-on-track-for-2026-launch-ap-minister-janardhan-reddy"),
"imo":("IMO: MEPC 84 outcome","https://www.imo.org/en/mediacentre/pressbriefings/pages/imo-progresses-work-on-ship-emissions-pollution-and-ocean-protection.aspx"),
"history":("VPA: Our History","https://vizagport.com/Template/navigateTemplate/gnt/T3VyIEhpc3Rvcnk="),
"reddit":("r/Visakhapatnam thread (search excerpt)","https://www.reddit.com/r/Visakhapatnam/comments/1suofu1/so_much_coal_dust_in_vizag/"),
"paradip":("Paradip Port Authority accounts 2025-26","https://paradipport.gov.in/annual-reports/"),
"chennai":("Chennai Port Authority Annual Report 2024-25","https://www.chennaiport.gov.in/"),
"apsez":("Adani Ports FY26 results","https://www.adaniports.com/newsroom/media-releases/apsez-fy26-revenue-grows-25-outperforms-guidance"),
"jsw":("India Shipping News: JSW Infrastructure FY26","https://indiashippingnews.com/ports/jsw-infrastructure-q4-fy26-results-net-profit-at-%e2%82%b91676-crore/"),
"grse":("PSU Watch: GRSE FY26","https://psuwatch.com/defencewatch/grses-net-profit-jumps-42-to-rs-748-crore-in-fy26"),
"csl":("Investywise: Cochin Shipyard FY26","https://www.investywise.com/?p=115298"),
"jobs":("Sarkari Jobs: VPA apprentices 2026","https://www.sarkarijobs.com/visakhapatnam-port-authority-apprentice-recruitment-2026-announced-apply-for-20-trade-apprentice-posts-by-september-23/"),
"derived":("Calculated by this project from the cited inputs",None),
}

def project(name, status, summary, caution, *sources):
    return dict(name=name, status=status, summary=summary, caution=caution, sources=list(sources))

data = dict(
 meta=dict(asOf="2026-11-24", title="Vizag Port, Explained",
  disclaimer="Independent academic project. Not affiliated with or endorsed by Visakhapatnam Port Authority. Built from public documents by a former (May 2024) finance intern.",
  units="Rupees crore unless stated. 1 crore = 10 million. MMT = million metric tonnes. FY25 = April 2024 to March 2025.",
  tags=dict(verified="Read in a primary document", official="Official announcement or claim", reported="Media or company report", calculated="Calculated by this project", opinion="Public opinion, not representative")),
 headline=[
  dict(id="cargo26", value=91.17, unit="MMT", label="cargo handled in FY26, a record", tag="official", sources=["pib1112"]),
  dict(id="cargoYtd", value=54.45, unit="MMT", label="April to October 2026, up 8.88% (advance estimate)", tag="verified", sources=["bulletin"]),
  dict(id="income25", value=2115.27, unit="Rs crore", label="operating income in FY25", tag="verified", sources=["accounts"]),
  dict(id="pat25", value=675.41, unit="Rs crore", label="profit after tax in FY25; read with the audit chapter", tag="verified", sources=["accounts"]),
  dict(id="debt", value=0, unit="Rs crore", label="borrowings at 31 March 2025", tag="verified", sources=["admin25"]),
  dict(id="rank", value=4, unit="th", label="largest major port by cargo in FY25; second on the east coast", tag="verified", sources=["admin25"])],
 financials=years, balanceSheet=bs,
 financeNotes=["FY21 profit after tax is 238.64 in the accounts but 237.31 in that year's at-a-glance page.",
  "The auditor said FY16 profit before tax was overstated by Rs 191.75 crore.",
  "VPA publishes no cash-flow statement in the accounts read. Cash flow here is derived from the balance sheet and cash notes.",
  "Current liabilities are the balancing figure. FY24 and FY25 match the published totals.",
  "Figures are nominal, not adjusted for inflation."],
 growth=dict(period="FY17 to FY25", cargoCagrPct=3.9, incomeCagrPct=11.0, opexCagrPct=5.3, tag="calculated", sources=["accounts","derived"]),
 commodities=commodities,
 commodityHHI=dict(FY23=1667, FY24=1696, FY25=1917, note="'Other' is counted as one group, which overstates concentration."),
 trade=dict(period="FY25", note="Country totals only. No country-by-commodity or route data is published, so never draw precise ship tracks.",
  imports=trade(imp,513.4), exports=trade(exp,118.5), gulfImportSharePct=18.6,
  gulfNote="UAE, Iraq, Saudi Arabia, Qatar and Kuwait; all cargo. Some loads outside the Strait of Hormuz.", sources=["admin25","derived"]),
 operations=dict(berthCount="31 + 1 single point mooring", capacityMTPA=154.71, utilisationFY25Pct=53.4, staff=2272, trackKm=175, sidings=29, vesselsFY25=2127,
  largestInner="Baby Cape, to 14.5 m draft", largestOuter="Capesize, to 18.1 m draft",
  turnaroundDaysFY25={"All cargo":2.88,"Containers":0.89,"Liquid bulk":1.98,"Dry bulk, mechanised":2.32,"Dry bulk, conventional":4.49,"Break bulk":9.14},
  outputPerBerthDay=14010, berthOccupancyPct=dict(all=60,vpa=63,ppp=51),
  waiting=dict(portAccountHours=0.71,totalHours=5.01,period="Apr-Sep 2025",sources=["updateH1"]), berths=berths, sources=["admin25","update25"],
  berthNote="Each row is a berth record at 31 March 2025; combined berths share one figure. OR-2 was decommissioned. This list is not the full count of 31.",
  definitionBreak="From FY24, turnaround is measured from pilot boarding to de-boarding. Do not join earlier years in one line."),
 peers=dict(note="FY25 hours and tonnes per ship berth day, from one publication, extracted by machine.",
  rows=[dict(port=n,mmt=m,turnaroundHours=t,outputPerBerthDay=o) for n,m,t,o in [("Visakhapatnam",82.62,69.19,14010),("Paradip",150.41,46.16,34303),("Chennai",54.96,48.69,16900),("Kamarajar",48.41,46.66,26428),("JNPA",92.12,26.35,26893),("Deendayal",150.16,58.56,16664),("All major ports",854.86,49.47,18293)]],
  finance=[dict(port="Visakhapatnam",fy="FY25",operatingIncome=2115.27,operatingRatioPct=37.9,incomePerTonne=256),dict(port="Paradip",fy="FY26",operatingIncome=2530.14,operatingRatioPct=33.1,incomePerTonne=162),dict(port="Chennai",fy="FY25",operatingIncome=1094.34,operatingRatioPct=61.6,incomePerTonne=199)],
  financeNote="Different years and cargo mixes. Paradip and Chennai were read by OCR.",
  gangavaram=dict(fy="FY26",mmt=36.6,capacityMMT=64,revenue=1288.18,pat=210.19,incomePerTonne=352,tag="calculated",note="A separate private Adani port nearby. It books terminal-handling revenue; VPA is partly a landlord. Not a price comparison.",sources=["gpl","gplops"]),
  cppi=[dict(year=y,score=s) for y,s in ((2021,36),(2022,20),(2023,115),(2024,46),(2025,23))], cppiRank2025=104,
  cppiNote="Containers only, about 12% of VPA tonnage.", sources=["mopsw26","cppi","cppi23","paradip","chennai"]),
 insights=[
  dict(id="price",headline="Cargo grew 3.9% a year. Income grew 11%.",body="In FY17 the port earned Rs 150 for every tonne. By FY25 it earned Rs 256. Prices, cargo mix and land rent did more than volume.",tag="calculated",sources=["accounts","derived"]),
  dict(id="oil",headline="Oil is now three tonnes in every ten.",body="Petroleum went from 21.8% to 30.1% of cargo in two years. HPCL's Visakh refinery throughput rose from 8.41 to 15.31 MMT between FY22 and FY25, close to the rise in the port's crude and fuel imports. A strong match, not proof of one customer.",tag="calculated",sources=["admin25","hpcl","derived"]),
  dict(id="rail",headline="Rail's share fell from 46% to 35%.",body="Part of this is arithmetic: crude oil travels by pipe. Part is less iron ore and other cargo arriving by train.",tag="calculated",sources=["accounts","admin25","derived"]),
  dict(id="wait",headline="0.71 hours, or 5.01?",body="Waiting time often counts only delay charged to the port. Counting every cause, ships waited about five hours in April to September 2025.",tag="verified",sources=["updateH1"]),
  dict(id="cppi",headline="Top 20 for containers in 2023. Ranked 104th in 2025.",body="On the World Bank's current series the score went from 115 to 46 to 23. The 2023 headline was real. It is also out of date.",tag="verified",sources=["cppi","cppi23"])],
 audit=dict(title="What India's auditor found in FY25", sources=["admin25"], items=[
  dict(finding="Rs 237.97 crore of Rs 420.00 crore in dues was over five years old. Similar comments were made every year from FY20.",tag="verified"),
  dict(finding="Internal controls were described as not adequate. The audit raised 67 findings; VPA corrected 40 in the accounts.",tag="verified"),
  dict(finding="Confirmation for Rs 572.31 crore of pension-fund annuities was not produced.",tag="verified"),
  dict(finding="The gratuity fund was short by Rs 75.93 crore. In FY21 the auditor put the pension and gratuity gap at Rs 853.28 crore.",tag="verified")],
  reply="VPA's published replies include waiting for a Ministry policy on doubtful debts and staff shortages. Audit comments are findings, not proof of wrongdoing."),
 projects=[
  project("PPP berths WQ-6, WQ-7/8, EQ-6, EQ-7","under construction","About Rs 800 crore of private investment; due by 2027.","Some of these berths already handle cargo.","pib1111","admin25"),
  project("Operate-and-maintain contracts: WQ-1/1RE, WQ-2/3, EQ-3","approved","Foundation stone on 11 Nov 2026; about Rs 580 crore contract value.","The Rs 560 crore headline is smaller than these contracts. Contract value is not VPA capital spending.","pib1111"),
  project("Port promenade","operational","710 m public waterfront, opened 11 Nov 2026.","Reported at Rs 19 crore; the project page says Rs 15.90 crore.","pib1111","projects"),
  project("Internal flyovers, channel deepening, new rail bridge","proposed","Studies and board notes. Flyover estimate Rs 334.89 crore.","Not capacity.","projects"),
  project("Dugarajapatnam shipbuilding cluster","approved","In-principle approval. VPA owns half of the project company. Mazagon Dock signed an MoU on 18 Sep 2026.","In principle only: the feasibility report is under review and land is being acquired. Published figures of Rs 29,254, 30,000 and 15,000 crore measure different things.","dgma","mdl"),
  project("Pudimadaka green hydrogen hub","announced","NTPC Green hub, 46 km from VPA. Foundation stone January 2025; engineering and tendering continue.","Plans include its own jetty, so cargo for VPA is unproven.","ngel"),
  project("AM/NS Rajayyapeta steel plant","approved","Environmental clearance on 20 Mar 2026 for 8.2 MTPA; groundbreaking in March 2026.","A linked captive port is proposed; reported capacities conflict.","amns","amnsport"),
  project("Mulapeta, Machilipatnam, Ramayapatnam ports","under construction","State greenfield ports, officially targeted for late 2026.","Official target; completion not confirmed.","tnie")],
 swot=dict(
  strengths=["No borrowings; operating ratio of 37.9% in FY25","18.1 m draft in the outer harbour, plus an offshore crude mooring","Fourth-largest major port in FY25; four straight years of growth to FY26"],
  weaknesses=["Turnaround of 69.2 hours against a 49.5-hour major-port average (FY25)","Auditor: internal controls not adequate; old dues not provided for","World Bank container score fell in 2024 and again in 2025"],
  opportunities=["Four PPP berth projects due by 2027","Half-ownership of the Dugarajapatnam project company","A stated shift towards non-dusty cargo"],
  threats=["Scenario: an AM/NS captive port could affect pellet exports, 8.9% of FY25 cargo","18.6% of overseas imports came from five Gulf producers","New state ports, and unresolved dust in the city"], sources=["admin25","mopsw26","cppi","pib1111","amns"]),
 pulse=dict(note="A small sample of public threads, read as search excerpts. Not a survey.", themes=[
  dict(theme="Coal dust is the main complaint",tag="opinion",sources=["reddit"]),
  dict(theme="A port circular says most internal trucks were not fully covered; the state pollution board inspected on 19 Aug 2026",tag="verified",sources=["circ"]),
  dict(theme="No study was found that isolates the port's share of city dust",tag="calculated",sources=["derived"])]),
 history=[
  dict(year="1927-33",text="Bengal Nagpur Railway builds the inner harbour to export manganese ore.",sources=["history"]),
  dict(year="1933",text="SS Jaladurga arrives on 7 October. Lord Willingdon opens the port on 19 December.",sources=["history"]),
  dict(year="1964",text="Administration passes to the Port Trust in February.",sources=["history"]),
  dict(year="1975",text="Outer-harbour ore berths commissioned.",sources=["admin25"]),
  dict(year="1985",text="Offshore tanker terminal commissioned.",sources=["admin25"]),
  dict(year="2003",text="Container terminal commissioned.",sources=["admin25"]),
  dict(year="2026",text="FY26 ends at a record 91.17 MMT.",sources=["pib1112"])],
 marketPeers=dict(note="VPA is not listed. Shown for scale only, not investment advice. FY26, Rs crore.", rows=[
  dict(company="Adani Ports & SEZ",revenue=38736,pat=12782,detail="500.8 MMT of port cargo",tag="reported",sources=["apsez"]),
  dict(company="JSW Infrastructure",revenue=5361,pat=1676,detail="122 MMT; adjusted profit reported near 1,644",tag="reported",sources=["jsw"]),
  dict(company="Garden Reach Shipbuilders",revenue=7002,pat=748,detail="Shipbuilder",tag="reported",sources=["grse"]),
  dict(company="Cochin Shipyard",revenue=5022,pat=717,detail="Sources differ on the revenue line",tag="reported",sources=["csl"])]),
 recommendations=[
  dict(problem="Ships stay longer than at peer ports",evidence="69.2 hours against 49.5, FY25",action="Publish turnaround by cargo and cause; mechanise conventional dry bulk first",benefit="Frees berth days where EQ-6 and EQ-7 are 87% occupied",risk="Cargo mix explains part of the gap",measure="Mix-adjusted turnaround",sources=["mopsw26","admin25"]),
  dict(problem="Old unpaid dues",evidence="Rs 237.97 crore over five years old",action="Publish an ageing table; recover or provide by class of debtor",benefit="Cleaner profit and audit record",risk="Some dues are owed by government bodies",measure="Share of dues over five years old",sources=["admin25"]),
  dict(problem="Growing dependence on oil",evidence="30.1% of cargo in FY25",action="Disclose customer concentration; stress-test a Gulf disruption",benefit="Earlier warning",risk="Commercial confidentiality",measure="Top-customer share",sources=["admin25","hpcl"]),
  dict(problem="Dust and the city",evidence="Circular 1993/2026; inspection on 19 Aug 2026",action="Publish live air monitors and fund a source study",benefit="Evidence replaces argument",risk="Results may be uncomfortable",measure="PM10 at the port boundary",sources=["circ","projects"])],
 careers=dict(note="Roles to explore, not a forecast. VPA employed 2,272 people in March 2025. Twenty trade apprenticeships were advertised in 2026 and have closed.", sources=["admin25","jobs"], roles=[
  dict(area=a,roles=r) for a,r in [("Port operations","Terminal operations, traffic planning, commercial analysis"),("Shipping","Agency, chartering, trade-lane analysis"),("Supply chain","Network planning, rail and road logistics"),("Finance","Project finance, trade finance, port accounts and audit"),("Data","Maritime data, port systems, mapping"),("Energy and shipbuilding","Green-fuel logistics, contracts, procurement")]]),
 whatIf=dict(title="Run the port's numbers", tag="calculated", baseYear="FY25",
  warning="A teaching model, not a forecast. It applies one average income per tonne to every cargo because income by commodity is not published in this form.",
  cargoMMT={"POL":24.85,"Iron ore & pellets":11.57,"Coal":14.92,"Fertiliser":2.94,"Containers":9.94,"Other":18.40}, totalMMT=82.62, operatingIncome=2115.27, estateIncome=266.77, operatingExpenditure=801.73, variableIncomePerTonneRs=223.74, defaultVariableCostPct=30,
  formula="income = estateIncome + sum(cargo * (1 + change)) * 223.74 / 10; cost = 801.73 * (1 - v + v * newTonnes / 82.62); surplus = income - cost", sources=["admin25","accounts","derived"]),
 globalContext=[dict(text="IMO's Net-Zero Framework has not been adopted. Talks are due to resume on 4 December 2026, subject to confirmation.",tag="verified",sources=["imo"])],
 sources={k: dict(title=t, url=u) for k, (t, u) in src.items()},
)
data.update(analysis=an.analyse(years, bs), copy=an.COPY, readings=an.READINGS, hidden=an.HIDDEN, region=an.REGION, mous=an.MOUS, research=an.PAPERS)
w = data["whatIf"]
assert abs(sum(w["cargoMMT"].values()) - w["totalMMT"]) < 0.01
assert abs(w["estateIncome"] + w["totalMMT"] * w["variableIncomePerTonneRs"] / 10 - w["operatingIncome"]) < 0.1

def check_refs(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == "sources" and isinstance(v, list):
                assert set(v) <= set(src), v
            else:
                check_refs(v)
    elif isinstance(o, list):
        for x in o:
            check_refs(x)
check_refs({k: v for k, v in data.items() if k != "sources"})

out = pathlib.Path(__file__).resolve().parent.parent / "src/content/site-data.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
print("ok", out.stat().st_size, [b["currentRatioPct"] for b in bs])
