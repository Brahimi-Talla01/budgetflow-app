from app.models.role import RoleModel
from app.repositories.role_repo import RoleRepository


class RoleService:

    @staticmethod
    def get_all():
        return RoleRepository.get_all()

    @staticmethod
    def create_role(data):
        # Vérifier si existe déjà
        existing = RoleRepository.get_by_name(data["name"])
        if existing:
            return None, "Ce rôle existe déjà."

        new_role = RoleModel(name=data["name"])
        RoleRepository.create_role(new_role)

        return new_role, None

    @staticmethod
    def update_role(role_id, data):
        role = RoleRepository.get_by_id(role_id)
        if not role:
            return None, "Rôle non trouvé."

        if "name" in data:
            # Vérifier si le nom existe déjà
            existing = RoleRepository.get_by_name(data["name"])
            if existing and existing.roleId != role.roleId:
                return None, "Un rôle avec ce nom existe déjà."

            role.name = data["name"]

        RoleRepository.update_role()
        return role, None

    @staticmethod
    def delete_role(role_id):
        role = RoleRepository.get_by_id(role_id)
        if not role:
            return False, "Rôle non trouvé."

        RoleRepository.delete_role(role)
        return True, None
