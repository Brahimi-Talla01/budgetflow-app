from math import ceil

DEFAULT_PAGE = 1
DEFAULT_PER_PAGE = 5
MAX_PER_PAGE = 100


def _positive_int(raw, default):
    """Convertit un paramètre de requête en entier positif, sinon `default`."""
    try:
        value = int(raw)
    except (TypeError, ValueError):
        return default

    return value if value > 0 else default


def parse_pagination(args):
    """Lit `page` et `perPage` dans les query params.

    `perPage` est borné à `MAX_PER_PAGE` pour éviter qu'un client ne demande
    toute la base en une requête.
    """
    page = _positive_int(args.get("page", DEFAULT_PAGE), DEFAULT_PAGE)
    per_page = _positive_int(args.get("perPage", DEFAULT_PER_PAGE), DEFAULT_PER_PAGE)
    return page, min(per_page, MAX_PER_PAGE)


def build_pagination(page, per_page, total):
    """Décrit la page demandée et la borne à la dernière page existante."""
    total_pages = max(1, ceil(total / per_page))
    current_page = min(page, total_pages)
    start = (current_page - 1) * per_page
    end = min(start + per_page, total)

    return current_page, start, end, {
        "page": current_page,
        "perPage": per_page,
        "total": total,
        "totalPages": total_pages,
        "hasPrevious": current_page > 1,
        "hasNext": current_page < total_pages,
    }
