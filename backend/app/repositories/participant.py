from app.models.participant import Participant
from app.repositories.base import CRUDBase

class CRUDParticipant(CRUDBase[Participant]):
    pass

participant = CRUDParticipant(Participant)
