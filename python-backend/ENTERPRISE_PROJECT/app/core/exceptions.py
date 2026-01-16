from fastapi import HTTPException

class BusinessRuleException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=400, detail=detail)
