# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - link "Gamyeon logo" [ref=e5] [cursor=pointer]:
      - /url: /admin/dashboard
      - img "Gamyeon logo" [ref=e6]
    - generic [ref=e7]:
      - generic [ref=e8]:
        - heading "Gamyeon Backoffice" [level=1] [ref=e9]
        - paragraph [ref=e10]: 관리자 계정으로 로그인해주세요
        - generic [ref=e12]:
          - img [ref=e13]
          - generic [ref=e16]: 관리자 전용 접근
      - generic [ref=e18]:
        - generic [ref=e19]:
          - img [ref=e20]
          - text: fetch failed
        - generic [ref=e22]:
          - generic [ref=e23]: 이메일
          - generic [ref=e24]:
            - img [ref=e25]
            - textbox "이메일" [ref=e28]:
              - /placeholder: admin@interviewai.kr
        - generic [ref=e29]:
          - generic [ref=e30]: 비밀번호
          - generic [ref=e31]:
            - img [ref=e32]
            - textbox "비밀번호" [ref=e35]:
              - /placeholder: 비밀번호를 입력하세요
            - button [ref=e36]:
              - img [ref=e37]
        - button "로그인" [ref=e40]
  - button "Open Next.js Dev Tools" [ref=e46] [cursor=pointer]:
    - img [ref=e47]
  - alert [ref=e50]
```