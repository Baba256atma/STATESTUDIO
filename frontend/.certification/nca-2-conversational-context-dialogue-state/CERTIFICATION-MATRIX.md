# Certification matrix — NCA:2

| Case | Manager language | Dialogue move | Proof |
| --- | --- | --- | --- |
| A | Yes, about 20%. (after Nexora question) | ANSWER_NEXORA | unit A + live short-answer |
| B | 20%. | ANSWER_NEXORA | unit B; PERCENTAGE expected-information |
| C | Three months. | ANSWER_NEXORA | unit C; DURATION |
| D | What about Inventory? | TOPIC_SHIFT / PAUSE_TOPIC | unit D + live; Capacity suspended |
| E | Go back to Capacity. | RETURN_TO_TOPIC | unit E + live Returning to |
| F | Continue where we were. | RETURN_TO_TOPIC | unit F |
| G | Before that, show Delivery. | PAUSE / LOCATE | unit G; Capacity pending kept |
| H | Forget Capacity. Let's focus on Inventory. | CLOSE_TOPIC | unit H; Capacity abandoned |
| I | No, I meant Capacity Gap. | CORRECT | unit I; no business-data write |
| J | The second one. | FOLLOW_UP | unit J; Option B |
| K | Why that one? | FOLLOW_UP | unit K; last recommendation |
| L | That makes sense. | ACCEPT | unit L; no Decision |
| M | I don't like that option. | REJECT | unit M; comparison context kept |
| N | Yes → More orders | ANSWER_NEXORA | unit N; one investigation thread |
| O | That answers my question. | CLOSE_TOPIC | unit O; thread RESOLVED |
| P | Thanks. | ACKNOWLEDGE | unit P; thread remains |
| Q | Return after Forget Capacity | — | unit Q; pending not resurrected |
| R | Stage focus ≠ conversation subject | CONTINUE / UNDERSTAND | unit R; conversation subject wins |

Pipeline:

Previous state → Manager message → NCA:1 → NCA:2 move → topic/thread/pending resolution → existing capability → Advisor reply → updated state
