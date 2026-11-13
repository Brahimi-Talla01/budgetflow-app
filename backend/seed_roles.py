from app import create_app, db
from app.models.role import RoleModel

app = create_app()

with app.app_context():
    if RoleModel.query.count() == 0:
        admin = RoleModel(name="admin")
        user = RoleModel(name="user")

        db.session.add(admin)
        db.session.add(user)
        db.session.commit()

        print("Rôles créés avec succès !")
    else:
        print("Les rôles existent déjà.")
