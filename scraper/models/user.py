from sqlalchemy import Column, BigInteger, String, DateTime, ARRAY, func
from sqlalchemy.orm import relationship
from datetime import datetime
from scraper.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True)

    username = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    amount_deposited = Column(BigInteger, default=0, nullable=False)
    balance = Column(BigInteger, default=0, nullable=False)
    amount_placed = Column(BigInteger, default=0, nullable=False)
    amount_won = Column(BigInteger, default=0, nullable=False)
    bets_placed = Column(BigInteger, default=0, nullable=False)
    bets_won = Column(BigInteger, default=0, nullable=False)

    bets = relationship("Bet", back_populates="user", lazy="dynamic")

    def __repr__(self):
        return f"<User(username={self.username}, bets_placed={self.bets_placed})>"
