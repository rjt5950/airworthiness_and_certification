# Society for Airworthiness and Certification — two website versions

Both versions are independent static websites. Each folder contains its own HTML, CSS, JavaScript, logo, photograph, documentation, and visual previews. Neither version loads assets or scripts from the other.

| Version | Open | Navigation |
|---|---|---|
| Original single page | [singlepage/index.html](singlepage/index.html) | Menu links scroll to sections of the same page |
| Refined multipage | [multipage/index.html](multipage/index.html) | Separate pages, a clearer homepage, searchable resource previews, and a notices archive |

```text
WebKit/
  singlepage/
    index.html
    assets/
      css/styles.css
      js/main.js
      images/
    preview/
    tools/
    README.md
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
    preview/
    tools/
    README.md
```

Double-click either `index.html` to review it locally. Each version can also be copied or hosted independently without a build step or package installation.

To compare through a local server, run this command from the workspace root:

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Then open http://127.0.0.1:8080/singlepage/ or http://127.0.0.1:8080/multipage/.

Both versions support desktop and mobile layouts with a hamburger menu. Society content and photographs remain placeholders where approval is pending. Feedback forms are demonstrations only: no information is sent or stored.

The source handwritten layout image remains in the workspace root as a reference. It is not required to run either website.
