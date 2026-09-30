# EmailJS portfolio notification

Paste `contact-notification.html` into the **HTML/source editor** for `template_sd87jyc`, replacing the existing message body. This file is prepared locally; the EmailJS dashboard has not been changed.

Use these template settings:

| Setting    | Value                                                   |
| ---------- | ------------------------------------------------------- |
| Subject    | Portfolio enquiry: {{subject}}                          |
| To email   | domasigreoner@gmail.com (or your preferred fixed inbox) |
| From name  | Portfolio · {{name}}                                    |
| From email | Keep the connected service's default/verified sender    |
| Reply-To   | {{email}}                                               |

The existing contact form supplies all six body variables: `name`, `email`, `subject`, `message`, `initials`, and `time`. Time is formatted in Manila time. Keep the double-brace placeholders; these escape submitted content. Do not change them to triple braces. The template needs no private key, external image, font download, script, or tracking pixel.

Design: navy #181D31, muted teal #678983, parchment #E6DDC4, ivory #F0E9D2; Georgia headings and Arial body text; a dark envelope surrounding a warm correspondence sheet. The layout uses presentation tables, inline styles, explicit background colors, and an Outlook width wrapper. Media queries improve narrow-screen spacing; the fluid layout also works without them. Email clients may modify colors or typography.

`preview.html` contains fictitious sample content for local visual review only. Do not paste that file into EmailJS. Browser previews were inspected at desktop and mobile sizes; delivery and rendering in actual mail clients have not been tested.
