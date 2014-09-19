// SAMPLE
this.manifest = {
    "name": "Luceo Candidate Clipper",
    "icon": "icon48.png",
    "settings": [
        {
            "tab": i18n.get("information"),
            "group": i18n.get("login"),
            "name": "system",
            "type": "text",
            "label": i18n.get("system"),
            "text": i18n.get("x-characters-system")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("login"),
            "name": "username",
            "type": "text",
            "label": i18n.get("username"),
            "text": i18n.get("x-characters-login")
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("login"),
            "name": "password",
            "type": "text",
            "label": i18n.get("password"),
            "text": i18n.get("x-characters-pw"),
            "masked": true
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("login"),
            "name": "myDescription",
            "type": "description",
            "text": i18n.get("description")
        }
    ],
    "alignment": [
        [
            "system",
            "username",
            "password"
        ]
    ]
};
