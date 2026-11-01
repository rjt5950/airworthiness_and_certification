# Society for Airworthiness and Certification

This is static website containing HTML, CSS, JavaScript, logo, photograph, and documentation.

| Version | Open | Navigation |
|---|---|---|
| Refined multipage | [multipage/index.html](multipage/index.html) | multi pages, a clearer homepage, searchable resource previews, and a notices archive |

```text
airworthiness_and_certification/
  multipage/
    index.html
    pages/
      about.html
      dignitaries.html
      events.html
      contact.html
      e-certification-kit.html
      notices.html
    assets/
      css/
      js/
      images/
    README.md
```

To open through a local server, run this command from the workspace root:

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Then open http://127.0.0.1:8080/multipage/.

It supports desktop and mobile layouts with a hamburger menu. Society content and photographs remain placeholders where approval is pending. Feedback forms are demonstrations only: no information is sent or stored.
