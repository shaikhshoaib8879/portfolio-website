from flask_pymongo import PyMongo
from datetime import datetime, date

mongo = PyMongo()


def serialize_doc(doc):
    """Convert a MongoDB document to a JSON-serializable dict.

    Converts ObjectId _id to string 'id' and handles datetime fields.
    """
    if doc is None:
        return None
    result = {}
    for key, value in doc.items():
        if key == '_id':
            result['id'] = str(value)
        elif isinstance(value, (datetime, date)):
            result[key] = value.isoformat()
        else:
            result[key] = value
    return result


def calculate_duration(start_date, end_date=None):
    """Calculate human-readable duration between two dates.

    Replaces the SQLAlchemy Experience.duration @property.
    """
    if isinstance(start_date, str):
        start_date = datetime.fromisoformat(start_date).date()
    elif isinstance(start_date, datetime):
        start_date = start_date.date()
    # else: already a date object

    if isinstance(end_date, str):
        end_date = datetime.fromisoformat(end_date).date()
    elif isinstance(end_date, datetime):
        end_date = end_date.date()

    end = end_date if end_date else datetime.now().date()

    years = end.year - start_date.year
    months = end.month - start_date.month

    if months < 0:
        years -= 1
        months += 12

    if years > 0 and months > 0:
        return f"{years} year{'s' if years != 1 else ''}, {months} month{'s' if months != 1 else ''}"
    elif years > 0:
        return f"{years} year{'s' if years != 1 else ''}"
    else:
        return f"{months} month{'s' if months != 1 else ''}"
