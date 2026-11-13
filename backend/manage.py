import click
from flask_migrate import Migrate

from app import create_app
from app.extensions import db

app = create_app()
migrate = Migrate(app, db)


@app.cli.command("users-list")
def users_list():
    """Liste les comptes existants et le volume de données associé."""
    from app.models import ExpenseModel, IncomeModel, ProjectModel, UserModel

    users = UserModel.query.order_by(UserModel.userId).all()

    if not users:
        click.echo("Aucun utilisateur en base.")
        return

    click.echo(f"{'ID':<4} {'EMAIL':<35} {'RÔLE':<8} {'DÉPENSES':<9} {'REVENUS':<8} PROJETS")
    for user in users:
        expenses = ExpenseModel.query.filter_by(userId=user.userId).count()
        incomes = IncomeModel.query.filter_by(userId=user.userId).count()
        projects = ProjectModel.query.filter_by(userId=user.userId).count()
        role = user.role.name if user.role else "-"
        click.echo(
            f"{user.userId:<4} {user.email:<35} {role:<8} {expenses:<9} {incomes:<8} {projects}"
        )


@app.cli.command("user-set-password")
@click.option("--email", required=True, help="Email du compte à modifier.")
@click.option(
    "--password",
    prompt=True,
    hide_input=True,
    confirmation_prompt=True,
    help="Nouveau mot de passe (demandé de façon interactive).",
)
def user_set_password(email, password):
    """Définit un nouveau mot de passe pour un compte existant."""
    from app.models import UserModel

    user = UserModel.query.filter(db.func.lower(UserModel.email) == email.lower()).first()

    if not user:
        raise click.ClickException(f"Aucun compte avec l'email {email}.")

    user.set_password(password)
    db.session.commit()
    click.echo(f"Mot de passe mis à jour pour {user.email}.")


if __name__ == "__main__":
    app.run(debug=True)
