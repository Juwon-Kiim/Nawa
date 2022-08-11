package com.ssafy.five.domain.service;

import com.ssafy.five.controller.dto.req.RegistCmtReqDto;
import com.ssafy.five.controller.dto.req.UpdateCmtReqDto;
import com.ssafy.five.controller.dto.res.GetCmtResDto;
import com.ssafy.five.domain.entity.Board;
import com.ssafy.five.domain.entity.Comment;
import com.ssafy.five.domain.entity.Users;
import com.ssafy.five.domain.repository.BoardRepository;
import com.ssafy.five.domain.repository.CmtRepository;
import com.ssafy.five.domain.repository.UserRepository;
import com.ssafy.five.exception.BoardNotFoundException;
import com.ssafy.five.exception.CmtNotFoundException;
import com.ssafy.five.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CmtService {

    private final CmtRepository cmtRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Transactional(rollbackFor = {Exception.class})
    public void regist(RegistCmtReqDto registCmtReqDto) throws Exception {
        Board boardEntity = boardRepository.findById(registCmtReqDto.getBoardId()).orElseThrow(() -> new BoardNotFoundException());
        Users usersEntity = userRepository.findById(registCmtReqDto.getUserId()).orElseThrow(() -> new UserNotFoundException());
        Comment cmtEntity = cmtRepository.save(registCmtReqDto.toEntity(boardEntity, usersEntity));
        if (cmtEntity == null) {
            throw new Exception("댓글 등록 실패");
        }
    }

    public List<GetCmtResDto> findALLByBoardId(Long boardId) {
        Board boardEntity = boardRepository.findById(boardId).orElseThrow(() -> new BoardNotFoundException());
        List<Comment> list = cmtRepository.findALLByBoard(boardEntity);
        return list.stream().map(GetCmtResDto::new).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = {Exception.class})
    public void updateCmt(UpdateCmtReqDto updateCmtReqDto) throws Exception {
        int result = cmtRepository.updateCmt(updateCmtReqDto.getCmtId(), updateCmtReqDto.getCmtContent(), new Date());
        if (result == 0) {
            throw new Exception("댓글 수정 실패");
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public void deleteByCmtId(Long cmtId) throws Exception {
        Comment cmtEntity = cmtRepository.findById(cmtId).orElseThrow(() -> new CmtNotFoundException());
        if (cmtEntity == null) {
            throw new Exception("삭제할 댓글이 존재하지 않음");
        }
        cmtRepository.deleteById(cmtId);
    }
}