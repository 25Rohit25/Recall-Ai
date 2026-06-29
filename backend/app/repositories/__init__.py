from app.repositories.meeting import meeting
from app.repositories.transcript import transcript_repo
from app.repositories.summary import summary_repo
from app.repositories.intelligence import chapter_repo, decision_repo, risk_repo, follow_up_repo, insight_repo, action_item_repo
from app.repositories.chat import conversation_repo, message_repo
from app.repositories.participant import participant
from app.repositories.base import CRUDBase
from app.models.summary import MeetingSummary
from app.models.action_item import ActionItem
from app.models.topic import Topic
from app.models.tag import Tag

summary = CRUDBase[MeetingSummary](MeetingSummary)
action_item = CRUDBase[ActionItem](ActionItem)
topic = CRUDBase[Topic](Topic)
tag = CRUDBase[Tag](Tag)
