# Expose all models here so Alembic can discover them by importing from app.models
from app.models.meeting import Meeting
from app.models.participant import Participant, MeetingParticipant
from app.models.transcript import TranscriptSegment
from app.models.summary import MeetingSummary
from app.models.topic import Topic
from app.models.action_item import ActionItem
from app.models.tag import Tag, MeetingTag
from app.models.setting import MeetingSetting
from app.models.engagement import Comment, Highlight, FutureConversation, FutureConversationMessage
from app.models.intelligence import Chapter, Decision, Risk, FollowUp, Insight
from app.models.chat import AIConversation, AIMessage
from app.models.productivity import Bookmark, SearchHistory, RecentActivity
