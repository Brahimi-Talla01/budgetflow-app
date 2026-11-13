from datetime import date, datetime


def parse_date(value):
    """Convertit une date ISO (chaîne émise par le frontend) en objet `date`.

    Les colonnes SQLAlchemy `Date` n'acceptent pas de chaîne : sans conversion,
    SQLite rejette l'insertion et PostgreSQL dépend d'un cast implicite.
    """
    if isinstance(value, datetime):
        return value.date()

    if isinstance(value, date):
        return value

    if isinstance(value, str):
        return date.fromisoformat(value[:10])

    raise ValueError("Date invalide")
