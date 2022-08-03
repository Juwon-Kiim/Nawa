package com.ssafy.five.domain.service;


import com.ssafy.five.controller.dto.req.BlockReqDto;
import com.ssafy.five.controller.dto.req.ReportReqDto;
import com.ssafy.five.domain.entity.State;
import com.ssafy.five.domain.entity.Users;
import com.ssafy.five.domain.repository.ReportRepositery;
import com.ssafy.five.domain.repository.UserRepository;
import com.ssafy.five.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepositery reportRepositery;
    private final BlockService blockService;
    private final UserRepository userRepository;

    @Transactional
    public Map<String, String> reported(ReportReqDto reportReqDto) {
        Users user = userRepository.findById(reportReqDto.getReportTo()).orElseThrow(() -> new UserNotFoundException("존재하지 않는 사용자입니다."));

        Map<String, String> response = new HashMap<>();

        if (reportReqDto.getReportTo().equals(reportReqDto.getReportFrom())) {
            throw new UserNotFoundException("잘못된 입력입니다.");
        // 신고 한 적 있으면
        } else if (reportRepositery.findByReportFromAndReportTo(reportReqDto.getReportFrom(), reportReqDto.getReportTo()).isPresent()) {
            response.put("result", "FAIL");
            response.put("detail", "이미 신고한 사용자입니다.");
        } else {
            reportRepositery.save(reportReqDto.reported());

            // 유저 정보 업데이트
            int reportCount = user.getReportCount() + 1;
            State userState = State.NORMAL;
            Calendar date = Calendar.getInstance();
            Date endDate = user.getEndDate();

            // 신고 누적이 5회면 일주일 정지, 10회면 20년(영구) 정지
            if (reportCount == 5) {
                date.add(Calendar.DATE, 7);
                endDate = new Date(date.getTimeInMillis());
                userState = State.STOP;
            } else if (reportCount == 10){
                date.add(Calendar.YEAR, 10);
                endDate = new Date(date.getTimeInMillis());
                userState = State.STOP;
            }

            // 유저 정보 업데이트
            Users updateUser = Users.builder()
                    .userId(user.getUserId())
                    .password(user.getPassword())
                    .birth(user.getBirth())
                    .emailId(user.getEmailId())
                    .emailDomain(user.getEmailDomain())
                    .name(user.getName())
                    .nickname(user.getNickname())
                    .ment(user.getMent())
                    .number(user.getNumber())
                    .gender(user.getGender())
    //                .picture(user.getPicture())
                    .point(user.getPoint())
                    .reportCount(reportCount)
                    .state(userState)
                    .endDate(endDate)
                    .role(user.getRole())
                    .build();

            userRepository.save(updateUser);

            // 차단까지 하기
            BlockReqDto blockReqDto = new BlockReqDto(reportReqDto.getReportFrom(), reportReqDto.getReportTo(), "신고 차단");
            blockService.addBlock(blockReqDto);

            response.put("result", "SUCCESS");
            response.put("detail", "신고가 정상적으로 접수되었습니다.");
        }

        return response;
    }
}
