package com.ssafy.five.domain.repository;

import com.ssafy.five.domain.entity.Mate;
import com.ssafy.five.domain.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MateRepository extends JpaRepository<Mate, Long> {

    List<Mate> findAllByMateUserId1OrMateUserId2(Users user1, Users user2);
}