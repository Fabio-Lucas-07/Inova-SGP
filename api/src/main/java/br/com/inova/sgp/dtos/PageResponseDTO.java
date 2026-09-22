package br.com.inova.sgp.dtos;

import java.util.List;
import java.util.function.Function;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public record PageResponseDTO<T>(
    List<T> content,
    int page,
    int limit,
    long totalCount,
    int totalPages
) {
    private static final int MAX_LIMIT = 100;

    public static <E, T> PageResponseDTO<T> from(Page<E> page, Function<E, T> mapper) {
        return new PageResponseDTO<>(page.getContent().stream().map(mapper).toList(),
            page.getNumber() + 1, page.getSize(), page.getTotalElements(), page.getTotalPages());
    }

    // page é base 1 na API; o Spring usa base 0
    public static Pageable pageable(int page, int limit, Sort sort) {
        return PageRequest.of(Math.max(page, 1) - 1, Math.min(Math.max(limit, 1), MAX_LIMIT), sort);
    }
}
