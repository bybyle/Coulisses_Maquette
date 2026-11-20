#!/usr/bin/env python3
"""Télécharge les fichiers de cdn001.tintin.com utilisés par index.html
et réécrit index.html pour qu'il utilise les copies locales (dossier assets/).

Usage :  python3 telecharger_assets.py        (dans le dossier contenant index.html)
"""
import os, re, sys, urllib.request, urllib.parse

HOST = "https://cdn001.tintin.com"
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "assets")
done = {}   # url -> chemin local relatif à ROOT


def fetch(url):
    """Télécharge url (les espaces/accents sont encodés), renvoie le chemin local relatif à ROOT."""
    if url in done:
        return done[url]
    path = urllib.parse.unquote(urllib.parse.urlparse(url).path)
    local = os.path.join("assets", path.lstrip("/")).replace("\\", "/")
    dest = os.path.join(ROOT, local)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest):                      # déjà présent (ex. tes CSS) : on ne retélécharge pas
        print("  déjà là", local)
        done[url] = local
        if dest.endswith(".css"):
            fix_css(dest, url)                    # mais on récupère les polices/images qu'il appelle
        return local
    safe = urllib.parse.quote(path, safe="/%")
    req = urllib.request.Request(HOST + safe, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
    except Exception as e:
        print("  ECHEC", url, e)
        done[url] = None
        return None
    with open(dest, "wb") as f:
        f.write(data)
    print("  ok  ", local)
    done[url] = local
    if dest.endswith(".css"):
        fix_css(dest, url)
    return local


def fix_css(dest, css_url):
    """Télécharge les url(...) d'une feuille CSS et les rend relatifs."""
    css = open(dest, encoding="utf-8", errors="replace").read()

    def repl(m):
        ref = m.group(2).strip()
        if ref.startswith(("data:", "#")):
            return m.group(0)
        absu = urllib.parse.urljoin(css_url, ref)
        if not absu.startswith(HOST):
            return m.group(0)
        local = fetch(absu.split("#")[0].split("?")[0])
        if not local:
            return m.group(0)
        rel = os.path.relpath(os.path.join(ROOT, local), os.path.dirname(dest)).replace("\\", "/")
        return "url(" + m.group(1) + rel + m.group(1) + ")"

    css = re.sub(r"url\((['\"]?)([^)'\"]+)\1\)", repl, css)
    open(dest, "w", encoding="utf-8").write(css)


def main():
    p = os.path.join(ROOT, "index.html")
    html = open(p, encoding="utf-8").read()
    urls = set(re.findall(r"https://cdn001\.tintin\.com/[^\"'<>)\s][^\"'<>)]*", html))
    # les noms de fichiers peuvent contenir des espaces : on capture jusqu'au guillemet
    urls |= set(re.findall(r"(?<=[\"'])https://cdn001\.tintin\.com/[^\"']+(?=[\"'])", html))
    urls = {u.strip() for u in urls}
    # CSS déjà placés en local : on récupère les polices/images qu'ils appellent
    for d, _, files in os.walk(os.path.join(OUT, "public")):
        for fn in files:
            if fn.endswith(".css"):
                full = os.path.join(d, fn)
                rel = os.path.relpath(full, OUT).replace("\\", "/")
                print("CSS local :", rel)
                fix_css(full, HOST + "/" + rel)
    print(len(urls), "fichiers à récupérer")
    for u in sorted(urls, key=len, reverse=True):   # les plus longs d'abord (noms avec espaces)
        local = fetch(u)
        if local:
            html = html.replace(u, local.replace(" ", "%20"))
    open(p, "w", encoding="utf-8").write(html)
    manquants = [u for u, l in done.items() if not l]
    print("\nTerminé.", len(manquants), "échec(s).")
    if manquants:
        print("\n".join(manquants))


if __name__ == "__main__":
    main()
